// ===== SUPABASE AUTH + CLOUD SYNC =====
//
// Fill these in after creating your Supabase project (see SETUP.md):
const SUPABASE_URL      = 'https://vcmhccmasvguhukptcze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbWhjY21hc3ZndWh1a3B0Y3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzk4MjAsImV4cCI6MjA5MTc1NTgyMH0.eepl3G8gmBQ1Ldm_udmHJ04lipyumuvk-UHVEQYodTg';
//
// Both values above are public by design. All access is gated by Postgres
// Row-Level Security (see SETUP.md). Never put the service_role key here.

(function () {
  const LAST_SYNCED_UID_KEY = 'wr-bp-last-synced-uid';
  const CLIENT_ID_KEY       = 'wr-bp-client-id';
  const PUSH_DEBOUNCE_MS    = 1500;

  let client         = null;
  let currentUser    = null;
  let currentToken   = null; // cached access JWT for sync-less fetch at unload
  let pushTimer      = null;
  let dirty          = false;
  let onlineListener = null;
  let applyingFromCloud = false; // set true while we write state from a pull — prevents echo push

  // ── Lazy-read client id (opaque per-browser identifier)
  function getClientId() {
    let id = null;
    try { id = localStorage.getItem(CLIENT_ID_KEY); } catch (e) {}
    if (!id) {
      id = 'c_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem(CLIENT_ID_KEY, id); } catch (e) {}
    }
    return id;
  }

  function isConfigured() {
    return SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL'
        && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
  }

  // ───────────────────────────────────────────────────────────
  // Init + auth state
  // ───────────────────────────────────────────────────────────
  function init() {
    if (!isConfigured()) {
      console.info('[sync] Supabase not configured — running in offline-only mode.');
      return;
    }
    if (!window.supabase || !window.supabase.createClient) {
      console.error('[sync] Supabase UMD script not loaded.');
      return;
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    // Pick up existing session (cached from previous visit)
    client.auth.getSession().then(({ data }) => {
      currentUser  = (data && data.session && data.session.user) || null;
      currentToken = (data && data.session && data.session.access_token) || null;
      renderAuthButton();
      if (currentUser) pullAndApply(currentUser.id);
    });

    // Bump + display the public visit counter. Fire-and-forget; failures are silent.
    trackVisit();

    // React to future sign-in / sign-out / token refresh
    client.auth.onAuthStateChange((event, session) => {
      currentUser  = (session && session.user) || null;
      currentToken = (session && session.access_token) || null;
      renderAuthButton();
      if (event === 'SIGNED_IN' && currentUser) {
        closeSignInModal();
        pullAndApply(currentUser.id);
      } else if (event === 'SIGNED_OUT') {
        setSyncStatus('idle');
      }
    });

    // Cross-tab: another tab updated state in localStorage → reload our state
    window.addEventListener('storage', (e) => {
      if (e.key === 'wr-bp-default-v1' && typeof window.reloadStateFromStorage === 'function') {
        window.reloadStateFromStorage();
      }
    });

    // Retry any pending push when we come back online
    onlineListener = () => { if (dirty) schedulePush(0); };
    window.addEventListener('online', onlineListener);

    // Flush pending push on tab close / hide via keepalive fetch (sendBeacon
     // can't set custom headers, so we use fetch with `keepalive: true` which
     // browsers allow during unload).
    const flush = () => {
      if (!dirty || !currentUser || !currentToken) return;
      clearTimeout(pushTimer);
      const body = buildPushBody();
      if (!body) return;
      try {
        fetch(`${SUPABASE_URL}/rest/v1/user_state?on_conflict=user_id`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(body),
          keepalive: true
        });
        dirty = false;
      } catch (_) {}
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  }

  // ───────────────────────────────────────────────────────────
  // Sign in / out
  // ───────────────────────────────────────────────────────────
  async function signInWithEmail(email) {
    if (!client) return { error: new Error('not_configured') };
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    return { error };
  }

  async function signOut(clearLocal) {
    if (!client) return;
    await client.auth.signOut();
    currentUser = null;
    renderAuthButton();
    if (clearLocal && typeof window.clearLocalStateAndReset === 'function') {
      window.clearLocalStateAndReset();
    }
    try { localStorage.removeItem(LAST_SYNCED_UID_KEY); } catch (e) {}
  }

  async function deleteAccountData() {
    if (!client || !currentUser) return { error: new Error('not_signed_in') };
    const { error } = await client.from('user_state').delete().eq('user_id', currentUser.id);
    return { error };
  }

  // ───────────────────────────────────────────────────────────
  // Pull + merge
  // ───────────────────────────────────────────────────────────
  async function pullAndApply(uid) {
    if (!client) return;
    setSyncStatus('saving');
    const { data, error } = await client
      .from('user_state').select('*').eq('user_id', uid).maybeSingle();

    if (error) {
      console.warn('[sync] pull failed:', error);
      setSyncStatus('error');
      return;
    }

    const local = window.getSyncableState ? window.getSyncableState() : null;
    const lastSyncedUid = (() => { try { return localStorage.getItem(LAST_SYNCED_UID_KEY); } catch (e) { return null; } })();
    const rememberUid = () => { try { localStorage.setItem(LAST_SYNCED_UID_KEY, uid); } catch (e) {} };

    if (!data) {
      // Cloud row missing — seed from local
      rememberUid();
      schedulePush(0); // push whatever local has now
      setSyncStatus('saved');
      return;
    }

    const cloud = rowToState(data);

    if (isEmptyState(local)) {
      applyRemoteState(cloud);
      rememberUid();
      setSyncStatus('saved');
      return;
    }

    if (lastSyncedUid === uid) {
      // Same device + same account previously signed in here — trust cloud (last-write-wins)
      applyRemoteState(cloud);
      setSyncStatus('saved');
      return;
    }

    // Conflict: non-empty local + non-empty cloud + this uid hasn't signed in here before
    openMergeModal(local, cloud, (choice) => {
      if (choice === 'cloud')       applyRemoteState(cloud);
      else if (choice === 'local')  schedulePush(0);
      else if (choice === 'merge')  applyRemoteState(mergeStates(local, cloud));
      rememberUid();
      setSyncStatus('saved');
    });
  }

  // ───────────────────────────────────────────────────────────
  // Push (debounced)
  // ───────────────────────────────────────────────────────────
  function schedulePush(delay) {
    if (!client || !currentUser || applyingFromCloud) return;
    dirty = true;
    clearTimeout(pushTimer);
    const ms = (typeof delay === 'number') ? delay : PUSH_DEBOUNCE_MS;
    pushTimer = setTimeout(pushNow, ms);
    setSyncStatus('saving');
  }

  async function pushNow() {
    if (!client || !currentUser) return;
    const body = buildPushBody();
    if (!body) return;
    const { error } = await client.from('user_state').upsert(body, { onConflict: 'user_id' });
    if (error) {
      console.warn('[sync] push failed:', error);
      setSyncStatus('error');
      // leave dirty = true; we'll retry on next saveState or online event
      return;
    }
    dirty = false;
    setSyncStatus('saved');
  }

  function buildPushBody() {
    if (!currentUser) return null;
    const s = window.getSyncableState && window.getSyncableState();
    if (!s) return null;
    return {
      user_id: currentUser.id,
      pool: s.pool,
      junglers: s.junglers,
      starred: s.starred,
      champ_data: s.champData,
      extra_tags: s.extraTags,
      client_updated_at: Date.now(),
      client_id: getClientId()
    };
  }

  // ───────────────────────────────────────────────────────────
  // State shape helpers
  // ───────────────────────────────────────────────────────────
  function rowToState(row) {
    return {
      pool:      Array.isArray(row.pool) ? row.pool : [],
      junglers:  Array.isArray(row.junglers) ? row.junglers : [],
      starred:   Array.isArray(row.starred) ? row.starred : [],
      champData: (row.champ_data && typeof row.champ_data === 'object') ? row.champ_data : {},
      extraTags: Array.isArray(row.extra_tags) ? row.extra_tags : []
    };
  }

  function isEmptyState(s) {
    if (!s) return true;
    return (s.pool.length === 0)
        && (s.junglers.length === 0)
        && (s.starred.length === 0)
        && (Object.keys(s.champData || {}).length === 0)
        && ((s.extraTags || []).length === 0);
  }

  function mergeStates(local, cloud) {
    const uniq = (a, b) => Array.from(new Set([...(a || []), ...(b || [])]));
    const champData = {};
    const allIds = new Set([...Object.keys(cloud.champData || {}), ...Object.keys(local.champData || {})]);
    allIds.forEach(id => {
      const l = local.champData && local.champData[id];
      const c = cloud.champData && cloud.champData[id];
      if (l && !c) champData[id] = l;
      else if (c && !l) champData[id] = c;
      else {
        // both exist — local wins on conflict but union the list fields
        champData[id] = {
          tags:      uniq(l.tags, c.tags),
          counters:  uniq(l.counters, c.counters),
          synergies: uniq(l.synergies, c.synergies)
        };
      }
    });
    return {
      pool:      uniq(local.pool,      cloud.pool),
      junglers:  uniq(local.junglers,  cloud.junglers),
      starred:   uniq(local.starred,   cloud.starred),
      champData: champData,
      extraTags: uniq(local.extraTags, cloud.extraTags)
    };
  }

  function applyRemoteState(s) {
    if (typeof window.setStateFromSync !== 'function') return;
    applyingFromCloud = true;
    try { window.setStateFromSync(s); }
    finally { applyingFromCloud = false; }
  }

  // ───────────────────────────────────────────────────────────
  // UI — auth button + sync dot
  // ───────────────────────────────────────────────────────────
  function renderAuthButton() {
    const btn  = document.getElementById('auth-btn');
    const dot  = document.getElementById('sync-dot');
    if (!btn) return;
    const tt = (k) => (typeof t === 'function' ? t(k) : k);
    if (currentUser) {
      const email = currentUser.email || '';
      const short = email.length > 22 ? email.slice(0, 20) + '…' : email;
      btn.textContent = short;
      btn.title = tt('sign_out');
      btn.classList.add('signed-in');
    } else {
      btn.textContent = tt('sign_in');
      btn.title = tt('sign_in');
      btn.classList.remove('signed-in');
    }
    if (dot) dot.classList.toggle('hidden', !currentUser);
  }

  function setSyncStatus(state) { // 'idle' | 'saving' | 'saved' | 'error'
    const dot = document.getElementById('sync-dot');
    if (!dot) return;
    dot.classList.remove('syncing', 'saved', 'sync-error');
    if (state === 'saving') dot.classList.add('syncing');
    else if (state === 'saved') dot.classList.add('saved');
    else if (state === 'error') dot.classList.add('sync-error');
  }

  // ───────────────────────────────────────────────────────────
  // UI — sign-in modal
  // ───────────────────────────────────────────────────────────
  function handleAuthButtonClick() {
    if (currentUser) openAccountMenu();
    else openSignInModal();
  }

  function openSignInModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    const input = document.getElementById('auth-email-input');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 30); }
    const msg = document.getElementById('auth-modal-msg');
    if (msg) { msg.textContent = ''; msg.className = 'auth-modal-msg'; }
  }

  function closeSignInModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
  }

  async function submitSignIn() {
    const input = document.getElementById('auth-email-input');
    const msg   = document.getElementById('auth-modal-msg');
    const btn   = document.getElementById('auth-submit-btn');
    if (!input || !msg || !btn) return;
    const email = (input.value || '').trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = t('auth_error_invalid_email');
      msg.className = 'auth-modal-msg err';
      return;
    }
    btn.disabled = true;
    msg.textContent = t('auth_sending');
    msg.className = 'auth-modal-msg';
    const { error } = await signInWithEmail(email);
    btn.disabled = false;
    if (error) {
      msg.textContent = t('auth_error_generic') + ' · ' + (error.message || '');
      msg.className = 'auth-modal-msg err';
      return;
    }
    msg.textContent = t('auth_check_inbox');
    msg.className = 'auth-modal-msg ok';
  }

  // ───────────────────────────────────────────────────────────
  // UI — account menu (signed-in)
  // ───────────────────────────────────────────────────────────
  function openAccountMenu() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    // Reuse the same modal; swap its body
    modal.classList.remove('hidden');
    const body = modal.querySelector('.auth-modal-body');
    if (!body) return;
    body.innerHTML = `
      <div class="auth-modal-title">${t('auth_signed_in_as')}</div>
      <div class="auth-modal-email">${currentUser && currentUser.email ? escapeHtml(currentUser.email) : ''}</div>
      <label class="auth-modal-check">
        <input type="checkbox" id="auth-clear-local-check"> ${t('auth_clear_local')}
      </label>
      <button class="btn auth-modal-btn" onclick="WRSync.signOutAndClose()">${t('sign_out')}</button>
      <div class="auth-modal-danger">
        <button class="btn-danger" onclick="WRSync.confirmDeleteAccount()">${t('auth_delete_account')}</button>
      </div>
      <div id="auth-modal-msg" class="auth-modal-msg"></div>
    `;
  }

  async function signOutAndClose() {
    const check = document.getElementById('auth-clear-local-check');
    const clearLocal = !!(check && check.checked);
    await signOut(clearLocal);
    closeSignInModal();
    // Reset the modal to sign-in form for next time
    const body = document.querySelector('#auth-modal .auth-modal-body');
    if (body) body.innerHTML = signInFormHtml();
  }

  async function confirmDeleteAccount() {
    if (!confirm(t('auth_delete_confirm'))) return;
    const { error } = await deleteAccountData();
    const msg = document.getElementById('auth-modal-msg');
    if (error) {
      if (msg) { msg.textContent = t('auth_error_generic') + ' · ' + (error.message || ''); msg.className = 'auth-modal-msg err'; }
      return;
    }
    if (msg) { msg.textContent = t('auth_deleted_ok'); msg.className = 'auth-modal-msg ok'; }
  }

  function signInFormHtml() {
    return `
      <div class="auth-modal-title">${t('sign_in')}</div>
      <div class="auth-modal-sub">${t('auth_email_label')}</div>
      <input type="email" id="auth-email-input" class="auth-email-input" placeholder="you@example.com"
             onkeydown="if(event.key==='Enter')WRSync.submit()">
      <button class="btn auth-modal-btn" id="auth-submit-btn" onclick="WRSync.submit()">${t('auth_send_link')}</button>
      <div id="auth-modal-msg" class="auth-modal-msg"></div>
    `;
  }

  // ───────────────────────────────────────────────────────────
  // UI — merge modal
  // ───────────────────────────────────────────────────────────
  function openMergeModal(local, cloud, onChoose) {
    const modal = document.getElementById('merge-modal');
    if (!modal) { onChoose('cloud'); return; } // fallback
    const body = modal.querySelector('.auth-modal-body');
    body.innerHTML = `
      <div class="auth-modal-title">${t('merge_title')}</div>
      <div class="auth-modal-sub">${t('merge_desc')}</div>
      <div class="merge-stats">
        <div><b>${t('merge_local')}</b>: ${describeState(local)}</div>
        <div><b>${t('merge_cloud')}</b>: ${describeState(cloud)}</div>
      </div>
      <button class="btn auth-modal-btn" id="merge-btn-merge">${t('merge_union')}</button>
      <button class="btn auth-modal-btn" id="merge-btn-cloud">${t('merge_use_cloud')}</button>
      <button class="btn auth-modal-btn" id="merge-btn-local">${t('merge_keep_local')}</button>
    `;
    modal.classList.remove('hidden');
    const close = (choice) => { modal.classList.add('hidden'); onChoose(choice); };
    body.querySelector('#merge-btn-merge').onclick = () => close('merge');
    body.querySelector('#merge-btn-cloud').onclick = () => close('cloud');
    body.querySelector('#merge-btn-local').onclick = () => close('local');
  }

  function describeState(s) {
    const overrideCount = Object.keys(s.champData || {}).length;
    return `${s.pool.length} / ${overrideCount} / ${(s.extraTags || []).length}`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ───────────────────────────────────────────────────────────
  // Visit counter — increments a single-row site_stats table via RPC
  // and renders the total into #visit-count.
  // ───────────────────────────────────────────────────────────
  // Pseudo-dynamic visit counter:
  //   Real mode: RPC increments DB by +1 per refresh, returns new total.
  //   Dummy mode: starts at 1000, +1 per refresh, persists in localStorage.
  //   Every 1..3 seconds the counter ticks up by 1..3 with a floating "+N"
  //   animation to feel alive. Monotonic — never goes backwards.
  const VISIT_BASE = 1000;
  const DUMMY_KEY  = 'wr-bp-dummy-visits';
  let displayedVisits = 0;
  let tickTimer = null;

  function tickDelta() {
    return Math.floor(Math.random() * 3) + 1; // 1..3
  }
  function nextTickDelay() {
    return 1000 + Math.floor(Math.random() * 4001); // 1000..5000ms
  }

  function renderVisitCount(n, animate) {
    const el = document.getElementById('visit-count');
    if (!el) return;
    const prev = displayedVisits;
    displayedVisits = n;
    el.textContent = n.toLocaleString();
    if (animate && n > prev) {
      const delta = n - prev;
      const parent = document.querySelector('.footer-visits');
      if (!parent) return;
      const bubble = document.createElement('span');
      bubble.className = 'visit-bubble';
      bubble.textContent = '+' + delta;
      parent.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1200);
    }
  }

  function trackVisit() {
    const host = window.location.hostname;
    const isLocal = window.location.protocol === 'file:'
      || host === 'localhost'
      || host === '127.0.0.1'
      || host === '0.0.0.0'
      || host.endsWith('.local');

    // Shared display logic: combines dummy base + real DB count + local
    // accumulator. Refresh always adds +1. Monotonic — display is
    // max(previous, 1000 + real_db_count) then + 1.
    const proceed = (realCount) => {
      let current = 0;
      try { current = parseInt(localStorage.getItem(DUMMY_KEY) || '0', 10) || 0; } catch (e) {}
      const baseline = VISIT_BASE + (realCount || 0);
      if (current < baseline) current = baseline;
      current += 1; // +1 per refresh
      try { localStorage.setItem(DUMMY_KEY, String(current)); } catch (e) {}
      renderVisitCount(current, false);
      startTicking();
    };

    if (isLocal || !client) {
      proceed(0);
      // Local-only: also query the real DB total so you can see it during
      // development even though the displayed counter uses a blended total.
      if (client) showRealCountInFooter();
      return;
    }

    // Production: bump real DB by 1, then blend into the displayed counter.
    client.rpc('increment_visits').then(({ data, error }) => {
      if (error || typeof data !== 'number') {
        console.warn('[visits] rpc failed, using dummy baseline:', error);
        proceed(0);
        return;
      }
      proceed(data);
    }).catch(() => { proceed(0); });

    // Realtime: when another visitor bumps the DB counter, raise our baseline.
    try {
      client.channel('site_stats_live')
        .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'site_stats', filter: 'id=eq.1' },
            (payload) => {
              const next = payload.new && payload.new.total_visits;
              if (typeof next !== 'number') return;
              const rebaselined = VISIT_BASE + next;
              if (rebaselined > displayedVisits) {
                renderVisitCount(rebaselined, true);
                try { localStorage.setItem(DUMMY_KEY, String(rebaselined)); } catch (e) {}
              }
            })
        .subscribe();
    } catch (e) { /* ignore realtime setup errors */ }
  }

  // Start the "visitor came in" ticker. Uses recursive setTimeout so each
  // tick fires after a random 1..3s delay, giving a more organic cadence
  // than a fixed setInterval.
  function startTicking() {
    if (tickTimer) return; // already running
    const scheduleNext = () => {
      tickTimer = setTimeout(() => {
        if (!document.hidden) tickVisitCount(tickDelta());
        scheduleNext();
      }, nextTickDelay());
    };
    scheduleNext();
  }

  function tickVisitCount(delta) {
    if (!displayedVisits) return;
    const next = displayedVisits + delta;
    renderVisitCount(next, true);
    try { localStorage.setItem(DUMMY_KEY, String(next)); } catch (e) {}
  }

  // Local-dev only: read the real DB total (no increment) and append a small
  // info span to the footer so you can see the actual production count while
  // the displayed number uses dummy data.
  function showRealCountInFooter() {
    if (!client) return;
    client.from('site_stats').select('total_visits').eq('id', 1).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) return;
        const footer = document.querySelector('.site-footer');
        if (!footer) return;
        let el = document.getElementById('real-visit-count');
        if (!el) {
          const span = document.createElement('span');
          span.className = 'footer-real-visits';
          span.innerHTML = '实际总访问: <span id="real-visit-count">—</span>';
          footer.insertBefore(span, footer.querySelector('.title-version'));
          el = span.querySelector('#real-visit-count');
        }
        el.textContent = (data.total_visits || 0).toLocaleString();
      }).catch(() => {});
  }

  // Public: fired by app.js on UI state changes (lane switch, screen change).
  window.bumpVisitCount = function () {
    tickVisitCount(tickDelta());
  };

  // ───────────────────────────────────────────────────────────
  // Public API
  // ───────────────────────────────────────────────────────────
  window.WRSync = {
    init,
    schedulePush,
    isSignedIn: () => !!currentUser,
    handleAuthButtonClick,
    openSignInModal,
    closeSignInModal,
    submit: submitSignIn,
    signOutAndClose,
    confirmDeleteAccount,
    renderAuthButton,     // app.js calls this after applyI18n so button text follows language
    signInFormHtml,       // initial modal body
  };

  // Auto-init after DOM + app.js are ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
