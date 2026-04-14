// ===== STATE =====
let state = {
  pool:       new Set(),  // champion ids in user's pool
  junglers:   new Set(),  // champion ids marked as jungler
  champData:  {},         // { [id]: { tags: string[], counters: string[] } }
  extraTags:  []          // user-created global keywords
};

let currentAddLane    = 'all';
let activeKeyword     = null;   // currently selected keyword chip
let editingChampId    = null;
let junglerOn         = false;
let kwPanelOpen       = false;
let currentCardPanelId = null;
let usePersonalData   = false;
const LEGACY_STATE_STORAGE_KEY = 'wr-bp-v1';

function isLocalDevEnvironment() {
  const host = window.location.hostname;
  return window.location.protocol === 'file:' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local');
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function hasAnyChampData(data) {
  return ((data && data.tags) || []).length > 0 ||
    ((data && data.counters) || []).length > 0 ||
    ((data && data.beCounteredBy) || []).length > 0;
}

function cloneChampDatum(data) {
  const cloned = {
    tags: [...((data && data.tags) || [])],
    counters: [...((data && data.counters) || [])]
  };
  if (data && hasOwn(data, 'beCounteredBy')) {
    cloned.beCounteredBy = [...(data.beCounteredBy || [])];
  }
  return cloned;
}

function sameChampDatum(a, b) {
  const aTags = (a && a.tags) || [];
  const bTags = (b && b.tags) || [];
  const aCounters = (a && a.counters) || [];
  const bCounters = (b && b.counters) || [];
  const aBeCounteredBy = (a && a.beCounteredBy) || [];
  const bBeCounteredBy = (b && b.beCounteredBy) || [];
  return JSON.stringify(aTags) === JSON.stringify(bTags) &&
    JSON.stringify(aCounters) === JSON.stringify(bCounters) &&
    JSON.stringify(aBeCounteredBy) === JSON.stringify(bBeCounteredBy);
}

function getDefaultChampData() {
  const seed = {};
  if (typeof DEFAULT_CHAMP_DATA !== 'undefined') {
    Object.keys(DEFAULT_CHAMP_DATA).forEach(id => {
      seed[id] = cloneChampDatum(DEFAULT_CHAMP_DATA[id]);
    });
  }
  return seed;
}

function getPersonalChampData() {
  const seed = getDefaultChampData();
  if (typeof PERSONAL_CHAMP_DATA !== 'undefined') {
    Object.keys(PERSONAL_CHAMP_DATA).forEach(id => {
      seed[id] = cloneChampDatum(PERSONAL_CHAMP_DATA[id]);
    });
  }
  return seed;
}

function getBaseChampData() {
  return usePersonalData ? getPersonalChampData() : getDefaultChampData();
}

function createEmptyState() {
  return {
    pool: new Set(),
    junglers: new Set(),
    champData: {},
    extraTags: []
  };
}

function getStateStorageKey() {
  return usePersonalData ? 'wr-bp-personal-v1' : 'wr-bp-default-v1';
}

function getEffectiveChampData(champId) {
  if (hasOwn(state.champData, champId)) return state.champData[champId];
  return getBaseChampData()[champId] || { tags: [], counters: [] };
}

function getEffectiveChampDataMap() {
  const map = getBaseChampData();
  Object.keys(state.champData).forEach(id => {
    map[id] = cloneChampDatum(state.champData[id]);
  });
  return map;
}

function ensureChampDataOverride(champId) {
  if (!hasOwn(state.champData, champId)) {
    state.champData[champId] = cloneChampDatum(getEffectiveChampData(champId));
  }
  if (!state.champData[champId].tags) state.champData[champId].tags = [];
  if (!state.champData[champId].counters) state.champData[champId].counters = [];
  if (!state.champData[champId].beCounteredBy) state.champData[champId].beCounteredBy = [];
  return state.champData[champId];
}

function normalizeStoredChampData(rawChampData, baseData = getBaseChampData()) {
  const normalized = {};

  Object.keys(rawChampData || {}).forEach(id => {
    const datum = cloneChampDatum(rawChampData[id]);
    if (!hasAnyChampData(datum) && !hasOwn(baseData, id)) {
      normalized[id] = datum;
      return;
    }
    if (sameChampDatum(datum, baseData[id])) {
      return;
    }
    normalized[id] = datum;
  });

  return normalized;
}

function rerenderCurrentView() {
  hideHoverPanel();
  buildKeywordChips();
  renderAddGrid();
  if (document.getElementById('pool-screen').classList.contains('active')) {
    renderPoolGrid();
  }
  if (editingChampId) {
    closeModal();
  }
}

function refreshStoredOverrides() {
  state.champData = normalizeStoredChampData(state.champData, getBaseChampData());
  saveState();
}

function initDataModeToggle() {
  const wrap = document.getElementById('local-data-toggle');
  const input = document.getElementById('use-personal-data-toggle');
  if (!wrap || !input) return;

  if (!isLocalDevEnvironment()) {
    wrap.remove();
    usePersonalData = false;
    return;
  }

  usePersonalData = localStorage.getItem('wr-bp-use-personal-data') === 'true';
  wrap.classList.remove('hidden');
  input.checked = usePersonalData;
  input.addEventListener('change', () => {
    saveState();
    usePersonalData = input.checked;
    localStorage.setItem('wr-bp-use-personal-data', usePersonalData ? 'true' : 'false');
    loadState();
    refreshStoredOverrides();
    rerenderCurrentView();
  });
}

// ===== PERSISTENCE =====
function loadState() {
  state = createEmptyState();
  try {
    const raw = localStorage.getItem(getStateStorageKey()) ||
      (usePersonalData ? localStorage.getItem(LEGACY_STATE_STORAGE_KEY) : null);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.pool       = new Set(parsed.pool      || []);
      state.junglers   = new Set(parsed.junglers  || []);
      state.champData  = normalizeStoredChampData(parsed.champData || {}, getBaseChampData());
      state.extraTags  = parsed.extraTags  || [];
    }
  } catch (e) { /* ignore */ }

  // Auto-mark default junglers for any pool members not yet flagged
  if (typeof DEFAULT_JUNGLERS !== 'undefined') {
    DEFAULT_JUNGLERS.forEach(id => {
      if (state.pool.has(id)) state.junglers.add(id);
    });
    saveState();
  }
}

function saveState() {
  localStorage.setItem(getStateStorageKey(), JSON.stringify({
    pool:      [...state.pool],
    junglers:  [...state.junglers],
    champData: state.champData,
    extraTags: state.extraTags || []
  }));
}

// ===== SCREEN ROUTING =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'pool-screen') {
    renderPoolGrid();
  } else if (id === 'add-screen') {
    renderAddGrid();
  }
}


// ===== SHARED MATCH FUNCTION (name + zhName + tags) =====
function champMatchesQuery(c, query) {
  if (!query) return true;
  if (c.name.toLowerCase().includes(query)) return true;
  if (c.id.toLowerCase().includes(query))   return true;
  if (c.zhName && c.zhName.includes(query)) return true;
  const tags = getEffectiveChampData(c.id).tags || [];
  return tags.some(t => t.includes(query));
}

// ===== RENDER POOL GRID =====
function renderPoolGrid() {
  const query = document.getElementById('pool-search').value.toLowerCase().trim();
  const grid  = document.getElementById('pool-grid');

  let champs = ALL_CHAMPIONS.filter(c => state.pool.has(c.id));

  if (query) {
    champs = champs.filter(c => champMatchesQuery(c, query));
  }

  grid.innerHTML = '';
  if (champs.length === 0) {
    grid.innerHTML = '<p style="color:#2a2a2a;padding:24px;grid-column:1/-1;">英雄池为空 — 点击「加入新英雄」添加</p>';
    return;
  }

  // Junglers on top
  const junglers    = champs.filter(c =>  state.junglers.has(c.id));
  const nonJunglers = champs.filter(c => !state.junglers.has(c.id));
  junglers.forEach(c    => grid.appendChild(buildCard(c, 'pool')));
  nonJunglers.forEach(c => grid.appendChild(buildCard(c, 'pool')));
}

// ===== KEYWORD CHIPS =====
function buildKeywordChips() {
  const all = new Set();
  Object.values(getEffectiveChampDataMap()).forEach(d => (d.tags || []).forEach(t => all.add(t)));
  (state.extraTags || []).forEach(t => all.add(t));

  const container = document.getElementById('keyword-chips');
  if (!container) return;
  container.innerHTML = '';

  // "全部" reset chip
  const allBtn = document.createElement('button');
  allBtn.className = 'kw-chip kw-chip-all' + (!activeKeyword ? ' active' : '');
  allBtn.textContent = '全部';
  allBtn.onclick = () => {
    activeKeyword = null;
    updateClearBtn();
    buildKeywordChips();
    renderAddGrid();
  };
  container.appendChild(allBtn);

  [...all].forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'kw-chip' + (activeKeyword === tag ? ' active' : '');
    btn.textContent = tag;
    btn.onclick = () => {
      activeKeyword = (activeKeyword === tag) ? null : tag;
      updateClearBtn();
      buildKeywordChips();
      renderAddGrid();
    };
    container.appendChild(btn);
  });

  // "+" add chip at end
  const plusBtn = document.createElement('button');
  plusBtn.className = 'kw-chip kw-chip-plus' + (kwPanelOpen ? ' active' : '');
  plusBtn.textContent = '+';
  plusBtn.onclick = (e) => { e.stopPropagation(); toggleKwPanel(); };
  container.appendChild(plusBtn);
}

// ===== KEYWORD ADD PANEL (create new keyword) =====
function toggleKwPanel() {
  const panel = document.getElementById('kw-add-panel');
  kwPanelOpen = !kwPanelOpen;
  buildKeywordChips();
  if (kwPanelOpen) {
    panel.classList.remove('hidden');
    const inp = document.getElementById('kw-create-input');
    if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 30); }
  } else {
    panel.classList.add('hidden');
  }
}

function createKeyword() {
  const inp = document.getElementById('kw-create-input');
  if (!inp) return;
  const tag = inp.value.trim();
  if (!tag) return;
  if (!state.extraTags) state.extraTags = [];
  if (!state.extraTags.includes(tag)) {
    state.extraTags.push(tag);
    saveState();
  }
  inp.value = '';
  kwPanelOpen = false;
  document.getElementById('kw-add-panel').classList.add('hidden');
  buildKeywordChips();
}

// ===== LANE TAB SWITCH (ADD SCREEN) =====
function switchAddLane(lane) {
  currentAddLane = lane;
  document.querySelectorAll('.lane-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('lane-' + lane).classList.add('active');
  renderAddGrid();
}

function onAddSearch() {
  // Clear active keyword when typing
  if (document.getElementById('add-search').value) {
    activeKeyword = null;
    buildKeywordChips();
  }
  updateClearBtn();
  renderAddGrid();
}

function clearAddSearch() {
  document.getElementById('add-search').value = '';
  activeKeyword = null;
  updateClearBtn();
  buildKeywordChips();
  renderAddGrid();
}

function updateClearBtn() {
  const input = document.getElementById('add-search');
  const btn   = document.getElementById('btn-clear-search');
  if (!btn) return;
  btn.style.display = (input.value || activeKeyword) ? 'flex' : 'none';
}

// ===== RENDER ADD GRID =====
function renderAddGrid() {
  const query = document.getElementById('add-search').value.toLowerCase().trim();
  const grid  = document.getElementById('add-grid');
  const label = document.getElementById('add-selected-label');

  let champs = ALL_CHAMPIONS;

  // Filter by lane tab
  if (currentAddLane !== 'all' && typeof LANE_DATA !== 'undefined') {
    const laneIds = new Set(LANE_DATA[currentAddLane] || []);
    champs = champs.filter(c => laneIds.has(c.id));
  }

  if (activeKeyword) {
    champs = champs.filter(c => {
      const tags = getEffectiveChampData(c.id).tags || [];
      return tags.includes(activeKeyword);
    });
  } else if (query) {
    champs = champs.filter(c => champMatchesQuery(c, query));
  }

  // Order: selected junglers → selected non-junglers → unselected
  const selJungle    = champs.filter(c =>  state.pool.has(c.id) &&  state.junglers.has(c.id));
  const selNonJungle = champs.filter(c =>  state.pool.has(c.id) && !state.junglers.has(c.id));
  const unselected   = champs.filter(c => !state.pool.has(c.id));

  label.classList.toggle('hidden', selJungle.length === 0 && selNonJungle.length === 0);

  grid.innerHTML = '';
  selJungle.forEach(c    => grid.appendChild(buildCard(c, 'add')));
  selNonJungle.forEach(c => grid.appendChild(buildCard(c, 'add')));
  unselected.forEach(c   => grid.appendChild(buildCard(c, 'add')));

}

// ===== BUILD CHAMPION CARD =====
function buildCard(champ, mode) {
  const inPool   = state.pool.has(champ.id);
  const isJungle = state.junglers.has(champ.id);

  const card = document.createElement('div');
  card.className = 'champ-card';
  card.dataset.champId = champ.id;

  if (mode === 'add') {
    card.classList.add(inPool ? 'is-in-pool' : 'not-in-pool');
  } else {
    if (isJungle) card.classList.add('is-jungle');
  }

  const img = document.createElement('img');
  img.src   = getChampionIcon(champ.id, champ.wrOnly);
  img.alt   = champ.name;
  img.addEventListener('error', () => { img.src = PLACEHOLDER_IMG; });

  const name = document.createElement('div');
  name.className = 'champ-name';
  if (champ.zhName) {
    name.innerHTML = `<span class="zh">${champ.zhName}</span><span class="en">${champ.name}</span>`;
  } else {
    name.textContent = champ.name;
  }

  card.appendChild(img);
  card.appendChild(name);

  if (mode === 'add' && inPool) {
    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = '✓';
    card.appendChild(badge);
  }

  // Interactive hover panel
  attachHoverPanel(card, champ);

  // Click
  if (mode === 'add') {
    card.addEventListener('click', () => {
      togglePool(champ.id);
      renderAddGrid();
    });
  } else {
    card.addEventListener('click', () => openModal(champ.id));
  }

  return card;
}

// ===== TOGGLE POOL MEMBERSHIP =====
function togglePool(id) {
  if (state.pool.has(id)) {
    state.pool.delete(id);
    state.junglers.delete(id);
  } else {
    state.pool.add(id);
    // Auto-mark as jungler if in the default jungler list
    if (typeof DEFAULT_JUNGLERS !== 'undefined' && DEFAULT_JUNGLERS.includes(id)) {
      state.junglers.add(id);
    }
  }
  saveState();
}

// ===== INTERACTIVE HOVER PANEL =====
const tooltipEl = document.getElementById('tooltip');
let hpTagPickerOpen      = false;
let hpCounterSearchOpen  = false;
let hpBeCounterSearchOpen = false;
let hpTimeout            = null;
let hpShowTimeout        = null;
let hpLocked             = false;   // suppresses all hover during navigation
let hpLockTimer          = null;
let hpSourceCard         = null;    // the card that triggered the current panel

function allKeywordTags() {
  const all = new Set();
  Object.values(getEffectiveChampDataMap()).forEach(d => (d.tags || []).forEach(t => all.add(t)));
  (state.extraTags || []).forEach(t => all.add(t));
  return all;
}

function attachHoverPanel(el, champ) {
  el.addEventListener('mouseenter', () => {
    if (hpLocked) return; // fully suppressed during navigation
    clearTimeout(hpTimeout);
    clearTimeout(hpShowTimeout);
    hpShowTimeout = setTimeout(() => showHoverPanel(champ, el), 300);
  });
  el.addEventListener('mouseleave', (e) => {
    clearTimeout(hpShowTimeout);
    if (el !== hpSourceCard) return;
    if (!tooltipEl.contains(e.relatedTarget)) hpTimeout = setTimeout(hideHoverPanel, 120);
  });
}

function showHoverPanel(champ, cardEl) {
  // Remove highlight from previous source card
  if (hpSourceCard) hpSourceCard.classList.remove('hp-active');
  currentCardPanelId    = champ.id;
  hpSourceCard          = cardEl;
  cardEl.classList.add('hp-active');
  hpTagPickerOpen       = false;
  hpCounterSearchOpen   = false;
  hpBeCounterSearchOpen = false;
  renderHoverPanel(champ.id);
  tooltipEl.classList.remove('hidden');
  positionHoverPanel(cardEl);

  tooltipEl.onmouseenter = () => clearTimeout(hpTimeout);
  tooltipEl.onmouseleave = (e) => {
    if (!cardEl.contains(e.relatedTarget)) hpTimeout = setTimeout(hideHoverPanel, 120);
  };
}

function positionHoverPanel(cardEl) {
  const img = cardEl.querySelector('img');
  const ref = img ? img.getBoundingClientRect() : cardEl.getBoundingClientRect();
  const pw  = tooltipEl.offsetWidth  || 230;

  // Always show below the card
  const top = ref.bottom;

  // Left-align by default; if it overflows right, right-align to card's right edge
  let left = ref.left;
  if (left + pw > window.innerWidth - 6) left = ref.right - pw;
  if (left < 6) left = 6;

  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top  = top  + 'px';
}

// Reposition hover panel on scroll so it follows the source card
document.addEventListener('scroll', () => {
  if (hpSourceCard && !tooltipEl.classList.contains('hidden')) {
    positionHoverPanel(hpSourceCard);
  }
}, { passive: true, capture: true });

function hideHoverPanel() {
  tooltipEl.classList.add('hidden');
  if (hpSourceCard) hpSourceCard.classList.remove('hp-active');
  currentCardPanelId    = null;
  hpSourceCard          = null;
  hpTagPickerOpen       = false;
  hpCounterSearchOpen   = false;
  hpBeCounterSearchOpen = false;
  hpLocked              = false;
  clearTimeout(hpLockTimer);
}

// Compute "被克制": all champions whose counters list includes champId
function getBeCounteredBy(champId) {
  return ALL_CHAMPIONS.filter(c => {
    const cdata = getEffectiveChampData(c.id);
    return cdata && (cdata.counters || []).includes(champId);
  });
}

function renderHoverPanel(champId) {
  const champ = ALL_CHAMPIONS.find(c => c.id === champId);
  if (!champ) return;
  const data       = getEffectiveChampData(champId);
  const tags       = data.tags     || [];
  const counters   = data.counters || [];
  // Hard rule: a champion cannot appear in both 克制 and 被克制
  const countersSet = new Set(counters);
  const beCountered = getBeCounteredBy(champId).filter(cc => !countersSet.has(cc.id));
  const displayName = champ.zhName ? `${champ.zhName} · ${champ.name}` : champ.name;

  // ── Tags section ──
  let tagsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">关键词</span>
    <button class="hp-plus-btn" onclick="toggleHpTagPicker()">+</button>
  </div>`;
  if (tags.length > 0) {
    tagsHtml += '<div class="hp-tags">';
    tags.forEach(t => {
      tagsHtml += `<span class="hp-tag"><span class="hp-tag-link" onclick="hpClickTag('${t}')">${t}</span><button class="hp-tag-x" onclick="hpRemoveTag('${champId}','${t}')">×</button></span>`;
    });
    tagsHtml += '</div>';
  } else if (!hpTagPickerOpen) {
    tagsHtml += '<div class="hp-empty">暂无词条</div>';
  }
  if (hpTagPickerOpen) {
    const available = [...allKeywordTags()].filter(t => !tags.includes(t));
    tagsHtml += '<div class="hp-tag-picker-divider"></div>';
    tagsHtml += '<div class="hp-picker-label">可选</div>';
    if (available.length > 0) {
      tagsHtml += '<div class="hp-tag-picker">';
      available.forEach(t => {
        tagsHtml += `<button class="hp-tag-option" onclick="hpAddTag('${champId}','${t}')">${t}</button>`;
      });
      tagsHtml += '</div>';
    } else {
      tagsHtml += '<div class="hp-empty">所有词条已添加</div>';
    }
  }

  // ── 克制 section (this champ counters these) ──
  let ctrsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">克制</span>
    <button class="hp-plus-btn" onclick="toggleHpCounterSearch()">+</button>
  </div>`;
  if (counters.length > 0) {
    ctrsHtml += '<div class="hp-counters">';
    counters.forEach(cid => {
      const cc = ALL_CHAMPIONS.find(x => x.id === cid);
      if (!cc) return;
      ctrsHtml += `<div class="hp-counter-item">
        <img class="hp-nav-img" src="${getChampionIcon(cid, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'" onclick="hpNavigateToChamp('${cid}')">
        <span class="hp-nav-name" onclick="hpNavigateToChamp('${cid}')">${cc.zhName || cc.name}</span>
        <button class="hp-tag-x" onclick="hpRemoveCounter('${champId}','${cid}')">×</button>
      </div>`;
    });
    ctrsHtml += '</div>';
  } else if (!hpCounterSearchOpen) {
    ctrsHtml += '<div class="hp-empty">暂无克制记录</div>';
  }
  if (hpCounterSearchOpen) {
    ctrsHtml += `<input type="text" class="hp-counter-search" id="hp-counter-search"
      placeholder="搜索英雄..." oninput="hpRenderCounterResults('${champId}',this.value)"
      onclick="event.stopPropagation()">
    <div id="hp-counter-results" class="hp-counter-results"></div>`;
  }

  // ── 被克制 section (these champs counter this one) ──
  let beCtrsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">被克制</span>
    <button class="hp-plus-btn" onclick="toggleHpBeCounterSearch()">+</button>
  </div>`;
  if (beCountered.length > 0) {
    beCtrsHtml += '<div class="hp-counters">';
    beCountered.forEach(cc => {
      beCtrsHtml += `<div class="hp-counter-item">
        <img class="hp-nav-img" src="${getChampionIcon(cc.id, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'" onclick="hpNavigateToChamp('${cc.id}')">
        <span class="hp-nav-name" onclick="hpNavigateToChamp('${cc.id}')">${cc.zhName || cc.name}</span>
        <button class="hp-tag-x" onclick="hpRemoveBeCounter('${champId}','${cc.id}')">×</button>
      </div>`;
    });
    beCtrsHtml += '</div>';
  } else if (!hpBeCounterSearchOpen) {
    beCtrsHtml += '<div class="hp-empty">暂无被克制记录</div>';
  }
  if (hpBeCounterSearchOpen) {
    beCtrsHtml += `<input type="text" class="hp-counter-search" id="hp-be-counter-search"
      placeholder="搜索英雄..." oninput="hpRenderBeCounterResults('${champId}',this.value)"
      onclick="event.stopPropagation()">
    <div id="hp-be-counter-results" class="hp-counter-results"></div>`;
  }

  tooltipEl.innerHTML = `
    <div class="hp-champ-header">${displayName}</div>
    <div class="hp-section">${tagsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-hint"><span class="hp-hint-label">阵容关键词推荐：</span><br>1.<span class="hp-kw">肉</span>（视野） 2.<span class="hp-kw">前期/节奏</span> 3.<span class="hp-kw">后期/大C射手</span> 4.<span class="hp-kw">收割/刺客</span> 5. <span class="hp-kw">控制</span>（越多越好）</div>
    <div class="hp-divider"></div>
    <div class="hp-section">${ctrsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-section">${beCtrsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-hint"><span class="hp-hint-label">通用克制链（→表示克制）：</span><br><span class="hp-kw">刺客/控制/爆发</span> → <span class="hp-kw">后期大C射手</span><br><span class="hp-kw">后期大C射手</span> → <span class="hp-kw">肉</span><br><span class="hp-kw">肉</span> → <span class="hp-kw">刺客/爆发</span></div>
  `;

  const focusId = hpCounterSearchOpen ? 'hp-counter-search' : hpBeCounterSearchOpen ? 'hp-be-counter-search' : null;
  if (focusId) { const inp = document.getElementById(focusId); if (inp) setTimeout(() => inp.focus(), 30); }

  // re-position after content change
  if (currentCardPanelId) {
    const card = document.querySelector('.champ-card:hover');
    if (card) positionHoverPanel(card);
  }
}

function toggleHpTagPicker() {
  hpTagPickerOpen       = !hpTagPickerOpen;
  hpCounterSearchOpen   = false;
  hpBeCounterSearchOpen = false;
  renderHoverPanel(currentCardPanelId);
}

function toggleHpCounterSearch() {
  hpCounterSearchOpen   = !hpCounterSearchOpen;
  hpTagPickerOpen       = false;
  hpBeCounterSearchOpen = false;
  renderHoverPanel(currentCardPanelId);
}

function toggleHpBeCounterSearch() {
  hpBeCounterSearchOpen = !hpBeCounterSearchOpen;
  hpTagPickerOpen       = false;
  hpCounterSearchOpen   = false;
  renderHoverPanel(currentCardPanelId);
}

function hpAddTag(champId, tag) {
  const data = ensureChampDataOverride(champId);
  if (!data.tags.includes(tag)) {
    data.tags.push(tag);
    saveState();
  }
  hpTagPickerOpen = false;
  renderHoverPanel(champId);
}

function hpRemoveTag(champId, tag) {
  const data = ensureChampDataOverride(champId);
  data.tags = (data.tags || []).filter(t => t !== tag);
  saveState();
  renderHoverPanel(champId);
}

function hpRenderCounterResults(champId, query) {
  const results = document.getElementById('hp-counter-results');
  if (!results) return;
  const q = query.toLowerCase().trim();
  if (!q) { results.innerHTML = ''; return; }
  const existing = new Set((getEffectiveChampData(champId) || {}).counters || []);
  const candidates = ALL_CHAMPIONS.filter(c => {
    if (c.id === champId || existing.has(c.id)) return false;
    return c.name.toLowerCase().includes(q) || (c.zhName && c.zhName.includes(q));
  }).slice(0, 12);
  results.innerHTML = '';
  candidates.forEach(cc => {
    const row = document.createElement('div');
    row.className = 'hp-result-row';
    row.innerHTML = `<img src="${getChampionIcon(cc.id, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'">
      <span>${cc.zhName || cc.name}</span>`;
    row.onclick = (e) => { e.stopPropagation(); hpAddCounter(champId, cc.id); };
    results.appendChild(row);
  });
  if (candidates.length === 0) results.innerHTML = '<div class="hp-empty">无匹配英雄</div>';
}

function hpAddCounter(champId, targetId) {
  const data = ensureChampDataOverride(champId);
  if (!data.counters.includes(targetId)) {
    data.counters.push(targetId);
    saveState();
  }
  const inp = document.getElementById('hp-counter-search');
  const val = inp ? inp.value : '';
  renderHoverPanel(champId);
  setTimeout(() => {
    const newInp = document.getElementById('hp-counter-search');
    if (newInp) { newInp.value = val; hpRenderCounterResults(champId, val); newInp.focus(); }
  }, 10);
}

function hpRemoveCounter(champId, targetId) {
  // champId counters targetId → remove targetId from champId.counters
  const data = ensureChampDataOverride(champId);
  data.counters = (data.counters || []).filter(c => c !== targetId);
  saveState();
  renderHoverPanel(champId);
}

// ── 被克制 functions ──
// "被克制" means: sourceId.counters includes champId
function hpRenderBeCounterResults(champId, query) {
  const results = document.getElementById('hp-be-counter-results');
  if (!results) return;
  const q = query.toLowerCase().trim();
  if (!q) { results.innerHTML = ''; return; }
  // Exclude champs already in "被克制" (i.e., already have champId in their counters)
  const alreadySet = new Set(getBeCounteredBy(champId).map(c => c.id));
  const candidates = ALL_CHAMPIONS.filter(c => {
    if (c.id === champId || alreadySet.has(c.id)) return false;
    return c.name.toLowerCase().includes(q) || (c.zhName && c.zhName.includes(q));
  }).slice(0, 12);
  results.innerHTML = '';
  candidates.forEach(cc => {
    const row = document.createElement('div');
    row.className = 'hp-result-row';
    row.innerHTML = `<img src="${getChampionIcon(cc.id, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'">
      <span>${cc.zhName || cc.name}</span>`;
    row.onclick = (e) => { e.stopPropagation(); hpAddBeCounter(champId, cc.id); };
    results.appendChild(row);
  });
  if (candidates.length === 0) results.innerHTML = '<div class="hp-empty">无匹配英雄</div>';
}

function hpAddBeCounter(champId, sourceId) {
  const sourceData = ensureChampDataOverride(sourceId);
  if (!sourceData.counters.includes(champId)) {
    sourceData.counters.push(champId);
    saveState();
  }
  const inp = document.getElementById('hp-be-counter-search');
  const val = inp ? inp.value : '';
  renderHoverPanel(champId);
  setTimeout(() => {
    const newInp = document.getElementById('hp-be-counter-search');
    if (newInp) { newInp.value = val; hpRenderBeCounterResults(champId, val); newInp.focus(); }
  }, 10);
}

function hpRemoveBeCounter(champId, sourceId) {
  const sourceData = ensureChampDataOverride(sourceId);
  sourceData.counters = (sourceData.counters || []).filter(c => c !== champId);
  saveState();
  renderHoverPanel(champId);
}

// ── Navigation from hover panel ──

// Click a tag → activate keyword filter and show matching champions
function hpClickTag(tag) {
  hideHoverPanel();
  activeKeyword = tag;
  document.getElementById('add-search').value = '';
  currentAddLane = 'all';
  updateClearBtn();
  document.querySelectorAll('.lane-tab').forEach(b => b.classList.remove('active'));
  const allTab = document.getElementById('lane-all');
  if (allTab) allTab.classList.add('active');
  buildKeywordChips();
  renderAddGrid();
}

// Click a champion avatar → clear filters, scroll to their card, show their hover
function hpNavigateToChamp(champId) {
  hideHoverPanel();
  activeKeyword = null;
  document.getElementById('add-search').value = '';
  currentAddLane = 'all';
  updateClearBtn();
  document.querySelectorAll('.lane-tab').forEach(b => b.classList.remove('active'));
  const allTab = document.getElementById('lane-all');
  if (allTab) allTab.classList.add('active');
  buildKeywordChips();
  renderAddGrid();
  // Lock hover immediately so nothing fires during scroll/render
  hpLocked = true;
  clearTimeout(hpLockTimer);

  // After grid re-renders, find the card, scroll to it, show its hover panel
  setTimeout(() => {
    const card = document.querySelector(`[data-champ-id="${champId}"]`);
    if (!card) { hpLocked = false; return; }
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const champ = ALL_CHAMPIONS.find(c => c.id === champId);
    if (!champ) { hpLocked = false; return; }
    setTimeout(() => {
      showHoverPanel(champ, card);
      // Ensure the hover panel is fully visible; if it overflows bottom, scroll down
      requestAnimationFrame(() => {
        const rect = tooltipEl.getBoundingClientRect();
        const overflow = rect.bottom - (window.innerHeight - 10);
        if (overflow > 0) {
          const grid = card.closest('.champ-grid') || document.getElementById('add-grid');
          if (grid) grid.scrollBy({ top: overflow + 10, behavior: 'smooth' });
        }
      });
      // Keep locked for 2s after showing, then release
      hpLockTimer = setTimeout(() => { hpLocked = false; }, 2000);
    }, 250);
  }, 50);
}

// Keep hideTooltip as alias for compatibility
function hideTooltip() { hideHoverPanel(); }

// ===== EDIT MODAL =====
function openModal(id) {
  editingChampId = id;
  const champ    = ALL_CHAMPIONS.find(c => c.id === id);
  if (!champ) return;

  // Ensure data slot exists
  ensureChampDataOverride(id);

  junglerOn = state.junglers.has(id);

  // Header
  const champObj = ALL_CHAMPIONS.find(c => c.id === id);
  document.getElementById('modal-champ-img').src  = getChampionIcon(id, champObj?.wrOnly);
  document.getElementById('modal-champ-img').onerror = function() { this.src = PLACEHOLDER_IMG; };
  document.getElementById('modal-champ-name').textContent = champ.name;

  // Toggle
  const track = document.getElementById('jungler-track');
  track.classList.toggle('on', junglerOn);

  // Reset counter search
  document.getElementById('counter-input').value = '';
  document.getElementById('counter-dropdown').innerHTML = '';

  renderModalTags();
  renderModalCounters();

  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  editingChampId = null;
  renderPoolGrid();
}

// --- Tags ---
function renderModalTags() {
  const tags = getEffectiveChampData(editingChampId).tags || [];
  const el   = document.getElementById('modal-tags');
  el.innerHTML = '';

  tags.forEach((tag, i) => {
    const pill = document.createElement('div');
    pill.className = 'tag-pill';
    pill.innerHTML = `<span>${tag}</span><button onclick="removeTag(${i})" title="删除">×</button>`;
    el.appendChild(pill);
  });
}

function addTag() {
  const input = document.getElementById('tag-input');
  const val   = input.value.trim();
  if (!val || !editingChampId) return;

  const data = ensureChampDataOverride(editingChampId);
  if (!data.tags.includes(val)) data.tags.push(val);
  input.value = '';
  saveState();
  renderModalTags();
}

function removeTag(i) {
  if (!editingChampId) return;
  ensureChampDataOverride(editingChampId).tags.splice(i, 1);
  saveState();
  renderModalTags();
}

// --- Counters ---
function renderModalCounters() {
  const counters = getEffectiveChampData(editingChampId).counters || [];
  const el       = document.getElementById('modal-counters');
  el.innerHTML   = '';

  counters.forEach(cid => {
    const cc = ALL_CHAMPIONS.find(x => x.id === cid);
    if (!cc) return;

    const pill = document.createElement('div');
    pill.className = 'counter-pill';
    pill.innerHTML = `
      <img src="${getChampionIcon(cid, ALL_CHAMPIONS.find(x=>x.id===cid)?.wrOnly)}" alt="${cc.name}" onerror="this.src='${PLACEHOLDER_IMG}'">
      <span class="cpill-name">${cc.name}</span>
      <button class="cpill-remove" onclick="removeCounter('${cid}')" title="移除">×</button>`;

    // Tooltip on counter pill
    const tempChamp = cc;
    attachTooltip(pill, tempChamp);

    el.appendChild(pill);
  });
}

function renderCounterDropdown() {
  const query    = document.getElementById('counter-input').value.toLowerCase().trim();
  const dropdown = document.getElementById('counter-dropdown');
  dropdown.innerHTML = '';

  if (!query) return;

  const existing = new Set((getEffectiveChampData(editingChampId) || {}).counters || []);
  const results  = ALL_CHAMPIONS.filter(c =>
    c.id !== editingChampId &&
    !existing.has(c.id) &&
    (c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query))
  ).slice(0, 10);

  results.forEach(cc => {
    const item = document.createElement('div');
    item.className = 'counter-drop-item';
    item.innerHTML = `
      <img src="${getChampionIcon(cc.id)}" alt="${cc.name}" onerror="this.src='${PLACEHOLDER_IMG}'">
      <span>${cc.name}</span>`;
    item.addEventListener('click', () => addCounter(cc.id));
    dropdown.appendChild(item);
  });
}

function addCounter(cid) {
  if (!editingChampId) return;
  const data = ensureChampDataOverride(editingChampId);
  if (!data.counters.includes(cid)) {
    data.counters.push(cid);
  }

  document.getElementById('counter-input').value    = '';
  document.getElementById('counter-dropdown').innerHTML = '';
  saveState();
  renderModalCounters();
}

function removeCounter(cid) {
  if (!editingChampId) return;
  const arr = ensureChampDataOverride(editingChampId).counters;
  const idx = arr.indexOf(cid);
  if (idx > -1) arr.splice(idx, 1);
  saveState();
  renderModalCounters();
}

// --- Jungler toggle ---
function toggleJungler() {
  if (!editingChampId) return;
  junglerOn = !junglerOn;
  const track = document.getElementById('jungler-track');
  track.classList.toggle('on', junglerOn);

  if (junglerOn) {
    state.junglers.add(editingChampId);
  } else {
    state.junglers.delete(editingChampId);
  }
  saveState();
}

// --- Remove from pool ---
function removeFromPool() {
  if (!editingChampId) return;
  const champ = ALL_CHAMPIONS.find(c => c.id === editingChampId);
  const name  = champ ? champ.name : editingChampId;
  if (!confirm(`将 ${name} 从英雄池移除?`)) return;

  state.pool.delete(editingChampId);
  state.junglers.delete(editingChampId);
  saveState();
  closeModal();
}

// ===== KEYBOARD SHORTCUTS =====
document.getElementById('tag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTag();
});

document.getElementById('counter-input').addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('counter-input').value = '';
    document.getElementById('counter-dropdown').innerHTML = '';
  }
});

// Close modal on backdrop click
document.getElementById('edit-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-modal')) closeModal();
});

// Close kw panel on outside click
document.addEventListener('click', e => {
  const kwPanel = document.getElementById('kw-add-panel');
  if (kwPanel && !kwPanel.classList.contains('hidden')) {
    if (!kwPanel.contains(e.target) && !e.target.classList.contains('kw-chip-plus') && !e.target.classList.contains('btn-add-kw')) {
      kwPanelOpen = false;
      kwPanel.classList.add('hidden');
      buildKeywordChips();
    }
  }
});

// ===== BACK TO TOP BUTTON =====
function scrollAddGridToTop() {
  const grid = document.getElementById('add-grid');
  if (grid) grid.scrollTo({ top: 0, behavior: 'smooth' });
}
(function initBackToTop() {
  const grid = document.getElementById('add-grid');
  const btn  = document.getElementById('back-to-top');
  if (!grid || !btn) return;
  const update = () => {
    if (grid.scrollTop > 200) btn.classList.remove('is-hidden');
    else btn.classList.add('is-hidden');
  };
  grid.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== INIT =====
initDataModeToggle();
loadState();
refreshStoredOverrides();
buildKeywordChips();
renderAddGrid();
