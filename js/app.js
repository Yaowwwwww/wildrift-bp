// ===== I18N =====
const LANG_STORAGE_KEY = 'wr-bp-lang';
let currentLang = 'en'; // default

const I18N = {
  en: {
    page_title: "Wild Rift BP System",
    title_header: 'WILDRIFT<span class="title-sep"></span>BP SYSTEM',
    title_desc: "Click champions to add to your pool, check traits to patch team gaps, use counters in BP to avoid being pressured / to pressure opponents",
    title_version: "Patch: 7.1a &nbsp; Latest Champion: K'Sante &nbsp; Author: 长风，梨花",
    lane_all: "All",
    lane_baron: "Baron",
    lane_jungle: "Jungle",
    lane_mid: "Mid",
    lane_adc: "ADC",
    lane_support: "Support",
    kw_create_ph: "Enter new tag name...",
    btn_create: "Create",
    search_ph: "Search champion / tag...",
    clear_search: "Clear search",
    my_pool: "My Champion Pool",
    filter_pool_only: "Pool only",
    filter_starred_only: "Starred only",
    kw_mark_starred: "Mark as starred",
    kw_star_toggle: "Toggle star",
    kw_delete: "Delete",
    kw_delete_confirm: "Delete this keyword from all champions?",
    tagline: "Craft your own BP codex, shaped by your understanding!",
    back_to_top: "Back to top",
    btn_back: "← Back",
    pool_search_ph: "Search champion / tag (e.g. tank, counter, carry)...",
    tags_label: "Tags",
    add_tag_ph: "Add tag...",
    btn_add: "Add",
    counters_label: "Counters (this champ counters these enemies)",
    counter_search_ph: "Search countered champion...",
    jungle_mark_label: "Jungle mark",
    mark_as_jungler: "Mark as jungler",
    remove_from_pool: "Remove from pool",
    pool_empty: "Pool is empty — click a champion to add",
    kw_all: "All",
    hp_keywords: "Keywords",
    hp_no_tags: "No tags",
    hp_available: "Available",
    hp_tag_search_ph: "Search tags...",
    hp_all_tags_added: "All tags added",
    hp_counters: "Counters",
    hp_no_counters: "No counters",
    hp_search_champ: "Search champion...",
    hp_be_countered: "Countered By",
    hp_no_be_countered: "None",
    hp_synergy: "Synergy",
    hp_no_synergy: "None",
    export_btn: "Export Data",
    sign_in: "Sign in",
    sign_out: "Sign out",
    auth_email_label: "Enter your email to receive a magic link:",
    auth_send_link: "Send magic link",
    auth_sending: "Sending…",
    auth_check_inbox: "Check your inbox for the sign-in link.",
    auth_error_generic: "Sign-in failed",
    auth_error_invalid_email: "Please enter a valid email address.",
    auth_signed_in_as: "Signed in as",
    auth_clear_local: "Also clear data on this device",
    auth_delete_account: "Delete all my cloud data",
    auth_delete_confirm: "Permanently delete your cloud data? Your local data is untouched.",
    auth_deleted_ok: "Cloud data deleted.",
    sync_saving: "Syncing…",
    sync_saved: "Saved",
    sync_error: "Sync error",
    merge_title: "Sync your existing data",
    merge_desc: "You have data on this device and in the cloud. Choose how to combine them (pool / tag edits / keywords):",
    merge_local: "This device",
    merge_cloud: "Cloud",
    merge_union: "Merge (recommended)",
    merge_use_cloud: "Use cloud, discard local",
    merge_keep_local: "Keep local, overwrite cloud",
    footer_visits: "Visits",
    hp_hint_comp_label: "Team Comp Keywords:",
    hp_hint_comp: '1.<span class="hp-kw">Tank</span> (Vision) 2.<span class="hp-kw">Early/Tempo</span> 3.<span class="hp-kw">Late/Hypercarry ADC</span> 4.<span class="hp-kw">Reaper/Assassin</span> 5. <span class="hp-kw">Control</span> (more the better)',
    hp_hint_chain_label: "Counter Chain (→ means counters):",
    hp_hint_chain: '<span class="hp-kw">Assassin/Control/Burst</span> → <span class="hp-kw">Hypercarry ADC</span><br><span class="hp-kw">Hypercarry ADC</span> → <span class="hp-kw">Tank</span><br><span class="hp-kw">Tank</span> → <span class="hp-kw">Assassin/Burst</span>',
    no_match: "No matching champions",
    delete: "Delete",
    remove: "Remove",
    confirm_remove: (name) => `Remove ${name} from pool?`,
    pin_title: "Pin to front",
    unpin_title: "Unpin",
  },
  cn: {
    page_title: "激斗峡谷 BP 系统",
    title_header: '激斗峡谷<span class="title-sep"></span>BP 系统',
    title_desc: "点击英雄可以加入自己的英雄池，查看特性来补阵容缺陷，克制关系BP避免对位压制/实现压制",
    title_version: "游戏版本：7.1a &nbsp; 最新英雄：奎桑提 &nbsp; Author: 长风, 梨花",
    lane_all: "全部",
    lane_baron: "上单",
    lane_jungle: "打野",
    lane_mid: "中单",
    lane_adc: "射手",
    lane_support: "辅助",
    kw_create_ph: "输入新词条名称...",
    btn_create: "创建",
    search_ph: "搜索英雄 / 词条...",
    clear_search: "清除搜索",
    my_pool: "我的英雄池",
    filter_pool_only: "英雄池",
    filter_starred_only: "星标",
    kw_mark_starred: "标记为星标",
    kw_star_toggle: "切换星标",
    kw_delete: "删除",
    kw_delete_confirm: "确定从所有英雄中删除这个词条吗？",
    tagline: "根据你的理解修改出属于自己的BP宝典！",
    back_to_top: "回到顶部",
    btn_back: "← 返回",
    pool_search_ph: "搜索英雄 / 词条（如：肉、针对、收割）...",
    tags_label: "词条 · Tags",
    add_tag_ph: "添加词条...",
    btn_add: "添加",
    counters_label: "克制英雄（此英雄克制以下敌方）",
    counter_search_ph: "搜索被克制的英雄...",
    jungle_mark_label: "打野标记",
    mark_as_jungler: "标记为打野",
    remove_from_pool: "从英雄池移除",
    pool_empty: "英雄池为空 — 点击「加入新英雄」添加",
    kw_all: "全部",
    hp_keywords: "关键词",
    hp_no_tags: "暂无词条",
    hp_available: "可选",
    hp_tag_search_ph: "搜索词条...",
    hp_all_tags_added: "所有词条已添加",
    hp_counters: "克制",
    hp_no_counters: "暂无克制记录",
    hp_search_champ: "搜索英雄...",
    hp_be_countered: "被克制",
    hp_no_be_countered: "暂无被克制记录",
    hp_synergy: "配合",
    hp_no_synergy: "暂无配合记录",
    export_btn: "导出数据",
    sign_in: "登录",
    sign_out: "退出登录",
    auth_email_label: "输入邮箱，我们会发送一条登录链接：",
    auth_send_link: "发送登录链接",
    auth_sending: "发送中…",
    auth_check_inbox: "请查收邮件并点击登录链接",
    auth_error_generic: "登录失败",
    auth_error_invalid_email: "请输入正确的邮箱地址",
    auth_signed_in_as: "已登录账号",
    auth_clear_local: "同时清除本设备数据",
    auth_delete_account: "删除我的云端数据",
    auth_delete_confirm: "确定永久删除云端数据吗？本地数据不受影响。",
    auth_deleted_ok: "云端数据已删除",
    sync_saving: "同步中…",
    sync_saved: "已同步",
    sync_error: "同步失败",
    merge_title: "合并数据",
    merge_desc: "本设备和云端都有数据，请选择合并方式（英雄池 / 词条编辑 / 关键词）：",
    merge_local: "本设备",
    merge_cloud: "云端",
    merge_union: "合并（推荐）",
    merge_use_cloud: "使用云端，丢弃本地",
    merge_keep_local: "保留本地，覆盖云端",
    footer_visits: "访问量",
    hp_hint_comp_label: "阵容关键词推荐：",
    hp_hint_comp: '1.<span class="hp-kw">肉</span>（视野） 2.<span class="hp-kw">前期/节奏</span> 3.<span class="hp-kw">后期/大C射手</span> 4.<span class="hp-kw">收割/刺客</span> 5. <span class="hp-kw">控制</span>（越多越好）',
    hp_hint_chain_label: "通用克制链（→表示克制）：",
    hp_hint_chain: '<span class="hp-kw">刺客/控制/爆发</span> → <span class="hp-kw">后期大C射手</span><br><span class="hp-kw">后期大C射手</span> → <span class="hp-kw">肉</span><br><span class="hp-kw">肉</span> → <span class="hp-kw">刺客/爆发</span>',
    no_match: "无匹配英雄",
    delete: "删除",
    remove: "移除",
    confirm_remove: (name) => `将 ${name} 从英雄池移除?`,
    pin_title: "置顶",
    unpin_title: "取消置顶",
  },
};

function t(key, ...args) {
  const entry = (I18N[currentLang] && I18N[currentLang][key]) ?? (I18N.en[key] ?? key);
  return typeof entry === 'function' ? entry(...args) : entry;
}

// Format a champion's display name based on current language
function displayChampName(c) {
  if (!c) return '';
  if (currentLang === 'en') return c.name || c.zhName || c.id;
  return c.zhName || c.name || c.id;
}

// ── Default tag translations (stored tags remain in Chinese, translate on display)
const TAG_MAP_EN = {
  "控制": "Control",
  "爆发": "Burst",
  "前期": "Early",
  "硬辅": "Hard Support",
  "开团": "Engage",
  "前中期节奏": "Early-Mid Tempo",
  "大C射手": "Hypercarry ADC",
  "风筝": "Kite",
  "刺客": "Assassin",
  "节奏": "Tempo",
  "单带": "Split Push",
  "后期": "Late",
  "破甲": "Armor Shred",
  "战士": "Fighter",
  "打肉": "Anti-Tank",
  "灵活保命": "Survivability",
  "中后期": "Mid-Late",
  "大后期": "Super Late",
  "增益": "Enchanter",
  "消耗pole": "Poke",
  "收割": "Reaper",
  "技能射手": "Skillshot ADC",
  "针对": "Pick",
  "poke消耗": "Poke",
  "消耗": "Harass",
  "支援": "Roam",
  "肉": "Tank",
  "全期": "All-Phase",
  "展示": "Execute",
};

function displayTag(tag) {
  if (currentLang === 'en' && TAG_MAP_EN[tag]) return TAG_MAP_EN[tag];
  return tag;
}

// Match a tag against a query in either language
function tagMatchesQuery(tag, query) {
  if (!query) return true;
  if (tag.toLowerCase().includes(query)) return true;
  const en = TAG_MAP_EN[tag];
  if (en && en.toLowerCase().includes(query)) return true;
  return false;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  document.title = t('page_title');
  document.documentElement.setAttribute('lang', currentLang === 'en' ? 'en' : 'zh');
  if (window.WRSync && window.WRSync.renderAuthButton) window.WRSync.renderAuthButton();
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'cn') lang = 'en';
  currentLang = lang;
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) {}
  document.body.classList.toggle('lang-en', lang === 'en');
  document.body.classList.toggle('lang-cn', lang === 'cn');
  applyI18n();
  // Re-render dynamic UI that contains i18n strings
  if (typeof buildKeywordChips === 'function') buildKeywordChips();
  if (typeof renderAddGrid === 'function') renderAddGrid();
  if (typeof currentCardPanelId !== 'undefined' && currentCardPanelId) {
    if (typeof renderHoverPanel === 'function') renderHoverPanel(currentCardPanelId);
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'cn' : 'en');
}

(function initLanguage() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_STORAGE_KEY); } catch (e) {}
  currentLang = (saved === 'cn') ? 'cn' : 'en';
  document.body.classList.add(currentLang === 'en' ? 'lang-en' : 'lang-cn');
})();

// ===== STATE =====
// Hardcoded priority keyword chips — pinned + highlighted by default.
// Users can star/unstar individual chips to override this list per-device.
const DEFAULT_PRIORITY_TAGS = ["控制", "肉", "打肉", "前期", "前中期", "前中期节奏", "中后期", "后期"];

let state = {
  pool:          new Set(),  // champion ids in user's pool
  junglers:      new Set(),  // champion ids marked as jungler
  starred:       new Set(),  // champion ids pinned to front
  champData:     {},         // { [id]: { tags: string[], counters: string[] } }
  extraTags:     [],         // user-created global keywords
  starredTags:   [],         // user-added priority keyword chips
  unstarredTags: []          // user-removed priority keyword chips (blacklist for DEFAULT_PRIORITY_TAGS)
};

let currentAddLane    = 'all';
let activeKeywords    = new Set();   // currently selected keyword chips (multi-select, AND filter)
let filterPoolOnly    = false;       // "英雄池" checkbox: only show champs in pool
let filterStarredOnly = false;       // "星标" checkbox: only show starred champs
let editingChampId    = null;
let junglerOn         = false;
let kwPanelOpen       = false;
let currentCardPanelId = null;
const STATE_STORAGE_KEY = 'wr-bp-default-v1';

// Champions whose portrait art has the face too small — zoom 2x and center-crop
const ZOOM_2X_CHAMPS = new Set([
  'Jax', 'Mordekaiser', 'Maokai', 'Fiddlesticks',
  'Vladimir', 'Zyra', 'Teemo', 'Shyvana'
]);

// Per-champion pixel offsets applied on top of the 2x zoom, to re-center the face.
// Positive y = shift content down; positive x = shift content right.
const ZOOM_OFFSETS = {
  Vladimir:    { x: -6,  y: 8 },
  Mordekaiser: { x: 4,   y: 16 },
  Maokai:      { x: -10, y: 0 },
  Jax:         { x: -4,  y: 8 },
  Teemo:       { x: 6,   y: 6 },
};

// Champions whose art should be mirrored horizontally.
const FLIP_CHAMPS = new Set(['Camille']);

// Per-champion zoom scale override (defaults to 2 for ZOOM_2X_CHAMPS).
const ZOOM_SCALES = {
  Teemo: 1.55,
};

function buildChampImgTransform(champId) {
  const parts = [];
  if (ZOOM_2X_CHAMPS.has(champId)) {
    const scale = ZOOM_SCALES[champId] || 2;
    parts.push(`scale(${scale})`);
    const off = ZOOM_OFFSETS[champId];
    if (off) parts.push(`translate(${off.x}px, ${off.y}px)`);
  }
  if (FLIP_CHAMPS.has(champId)) parts.push('scaleX(-1)');
  return parts.join(' ');
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function hasAnyChampData(data) {
  return ((data && data.tags) || []).length > 0 ||
    ((data && data.counters) || []).length > 0 ||
    ((data && data.beCounteredBy) || []).length > 0 ||
    ((data && data.synergies) || []).length > 0;
}

function cloneChampDatum(data) {
  const cloned = {
    tags: [...((data && data.tags) || [])],
    counters: [...((data && data.counters) || [])]
  };
  if (data && hasOwn(data, 'beCounteredBy')) {
    cloned.beCounteredBy = [...(data.beCounteredBy || [])];
  }
  if (data && hasOwn(data, 'synergies')) {
    cloned.synergies = [...(data.synergies || [])];
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
  const aSynergies = (a && a.synergies) || [];
  const bSynergies = (b && b.synergies) || [];
  return JSON.stringify(aTags) === JSON.stringify(bTags) &&
    JSON.stringify(aCounters) === JSON.stringify(bCounters) &&
    JSON.stringify(aBeCounteredBy) === JSON.stringify(bBeCounteredBy) &&
    JSON.stringify(aSynergies) === JSON.stringify(bSynergies);
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

function createEmptyState() {
  return {
    pool: new Set(),
    junglers: new Set(),
    starred: new Set(),
    champData: {},
    extraTags: [],
    starredTags: [],
    unstarredTags: []
  };
}

function getEffectiveChampData(champId) {
  if (hasOwn(state.champData, champId)) return state.champData[champId];
  return getDefaultChampData()[champId] || { tags: [], counters: [] };
}

function getEffectiveChampDataMap() {
  const map = getDefaultChampData();
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
  if (!state.champData[champId].synergies) state.champData[champId].synergies = [];
  return state.champData[champId];
}

function normalizeStoredChampData(rawChampData, baseData = getDefaultChampData()) {
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
  state.champData = normalizeStoredChampData(state.champData, getDefaultChampData());
  saveState();
}

// One-time cleanup of keys from the abandoned Default/Personal toggle era.
(function migrateLegacyKeys() {
  const MIGRATION_KEY = 'wr-bp-toggle-removed-v1';
  if (localStorage.getItem(MIGRATION_KEY) === 'done') return;
  localStorage.removeItem('wr-bp-personal-v1');
  localStorage.removeItem('wr-bp-use-personal-data');
  localStorage.removeItem('wr-bp-v1');
  localStorage.removeItem('wr-bp-personal-reset-v2');
  localStorage.setItem(MIGRATION_KEY, 'done');
})();

// ===== PERSISTENCE =====
function loadState() {
  state = createEmptyState();
  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.pool       = new Set(parsed.pool      || []);
      state.junglers   = new Set(parsed.junglers  || []);
      state.starred    = new Set(parsed.starred   || []);
      state.champData  = normalizeStoredChampData(parsed.champData || {}, getDefaultChampData());
      state.extraTags    = parsed.extraTags    || [];
      state.starredTags  = parsed.starredTags  || [];
      state.unstarredTags = parsed.unstarredTags || [];
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
  localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
    pool:          [...state.pool],
    junglers:      [...state.junglers],
    starred:       [...state.starred],
    champData:     state.champData,
    extraTags:     state.extraTags || [],
    starredTags:   state.starredTags || [],
    unstarredTags: state.unstarredTags || []
  }));
  if (window.WRSync && window.WRSync.schedulePush) window.WRSync.schedulePush();
}

// ===== SYNC INTEGRATION ===========================================
// Called by js/sync.js. Returns a plain-object snapshot of the user's
// personal state (Sets flattened to arrays) suitable for upsert.
window.getSyncableState = function () {
  return {
    pool:          [...state.pool],
    junglers:      [...state.junglers],
    starred:       [...state.starred],
    champData:     state.champData || {},
    extraTags:     state.extraTags || [],
    starredTags:   state.starredTags || [],
    unstarredTags: state.unstarredTags || []
  };
};

// Replace local state with a pulled snapshot from the cloud.
// The sync layer sets an internal flag around this call so that the
// saveState() it triggers doesn't echo back to the server.
window.setStateFromSync = function (s) {
  if (!s) return;
  state.pool          = new Set(s.pool      || []);
  state.junglers      = new Set(s.junglers  || []);
  state.starred       = new Set(s.starred   || []);
  state.champData     = s.champData || {};
  state.extraTags     = s.extraTags || [];
  state.starredTags   = s.starredTags || [];
  state.unstarredTags = s.unstarredTags || [];
  saveState();
  rerenderCurrentView();
};

// Re-read localStorage after a sibling tab wrote to it (cross-tab sync).
window.reloadStateFromStorage = function () {
  loadState();
  rerenderCurrentView();
};

// Hard reset used by "Sign out + clear this device's data".
window.clearLocalStateAndReset = function () {
  localStorage.removeItem(STATE_STORAGE_KEY);
  state = createEmptyState();
  rerenderCurrentView();
};
// ==================================================================

// ===== SCREEN ROUTING =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'pool-screen') {
    renderPoolGrid();
  } else if (id === 'add-screen') {
    renderAddGrid();
  }
  if (window.bumpVisitCount) window.bumpVisitCount();
}


// ===== SHARED MATCH FUNCTION (name + zhName + tags) =====
function champMatchesQuery(c, query) {
  if (!query) return true;
  if (c.name.toLowerCase().includes(query)) return true;
  if (c.id.toLowerCase().includes(query))   return true;
  if (c.zhName && c.zhName.includes(query)) return true;
  const tags = getEffectiveChampData(c.id).tags || [];
  return tags.some(tg => tagMatchesQuery(tg, query));
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
    grid.innerHTML = `<p style="color:#2a2a2a;padding:24px;grid-column:1/-1;">${t('pool_empty')}</p>`;
    return;
  }

  // Starred first, then junglers, then others
  const starred     = champs.filter(c =>  state.starred.has(c.id));
  const rest        = champs.filter(c => !state.starred.has(c.id));
  const junglers    = rest.filter(c =>  state.junglers.has(c.id));
  const nonJunglers = rest.filter(c => !state.junglers.has(c.id));
  starred.forEach(c     => grid.appendChild(buildCard(c, 'pool')));
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

  // "All" reset chip
  const allBtn = document.createElement('button');
  allBtn.className = 'kw-chip kw-chip-all' + (activeKeywords.size === 0 ? ' active' : '');
  allBtn.textContent = t('kw_all');
  allBtn.onclick = () => {
    activeKeywords.clear();
    updateClearBtn();
    buildKeywordChips();
    renderAddGrid();
  };
  container.appendChild(allBtn);

  // Priority = (DEFAULT_PRIORITY_TAGS − unstarred) ∪ starredTags
  const unstarred = new Set(state.unstarredTags || []);
  const userStarred = state.starredTags || [];
  const effectivePriority = [
    ...DEFAULT_PRIORITY_TAGS.filter(t => !unstarred.has(t)),
    ...userStarred.filter(t => !DEFAULT_PRIORITY_TAGS.includes(t))
  ];
  const prioritySet = new Set(effectivePriority);
  const pinned = effectivePriority.filter(tg => all.has(tg));
  const rest   = [...all].filter(tg => !prioritySet.has(tg));

  [...pinned, ...rest].forEach(tag => {
    const btn = document.createElement('button');
    const isPinned = prioritySet.has(tag);
    btn.className = 'kw-chip'
      + (isPinned ? ' kw-chip-priority' : '')
      + (activeKeywords.has(tag) ? ' active' : '');
    btn.innerHTML = `
      <span class="kw-chip-label">${displayTag(tag)}</span>
      <span class="kw-chip-star" title="${t('kw_star_toggle')}">★</span>
      <span class="kw-chip-x" title="${t('kw_delete')}">×</span>
    `;
    btn.querySelector('.kw-chip-star').onclick = (e) => {
      e.stopPropagation();
      toggleTagStarred(tag);
    };
    btn.querySelector('.kw-chip-x').onclick = (e) => {
      e.stopPropagation();
      deleteKeywordEverywhere(tag);
    };
    btn.onclick = () => {
      if (activeKeywords.has(tag)) activeKeywords.delete(tag);
      else activeKeywords.add(tag);
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
  if (!state.extraTags.includes(tag)) state.extraTags.push(tag);

  const starCheck = document.getElementById('kw-create-starred');
  if (starCheck && starCheck.checked) {
    if (!state.starredTags) state.starredTags = [];
    if (!state.starredTags.includes(tag)) state.starredTags.push(tag);
  }
  saveState();

  inp.value = '';
  if (starCheck) starCheck.checked = false;
  kwPanelOpen = false;
  document.getElementById('kw-add-panel').classList.add('hidden');
  buildKeywordChips();
}

function toggleTagStarred(tag) {
  if (!state.starredTags) state.starredTags = [];
  if (!state.unstarredTags) state.unstarredTags = [];

  const isDefault    = DEFAULT_PRIORITY_TAGS.includes(tag);
  const inStarred    = state.starredTags.includes(tag);
  const inUnstarred  = state.unstarredTags.includes(tag);
  const currentlyStarred = inStarred || (isDefault && !inUnstarred);

  if (currentlyStarred) {
    // Un-star: remove from starredTags, and if it's a default, blacklist it
    state.starredTags = state.starredTags.filter(t => t !== tag);
    if (isDefault && !inUnstarred) state.unstarredTags.push(tag);
  } else {
    // Re-star: remove from blacklist first, then add to starredTags for non-defaults
    state.unstarredTags = state.unstarredTags.filter(t => t !== tag);
    if (!isDefault && !inStarred) state.starredTags.push(tag);
  }
  saveState();
  buildKeywordChips();
}

function deleteKeywordEverywhere(tag) {
  // Remove from user-created extra tags
  if (state.extraTags) state.extraTags = state.extraTags.filter(t => t !== tag);
  // Remove from starred tags
  if (state.starredTags) state.starredTags = state.starredTags.filter(t => t !== tag);
  // Remove from every champion's tag list (treat as full delete)
  ALL_CHAMPIONS.forEach(c => {
    const data = getEffectiveChampData(c.id);
    if (data.tags && data.tags.includes(tag)) {
      const override = ensureChampDataOverride(c.id);
      override.tags = (override.tags || []).filter(t => t !== tag);
    }
  });
  // If it was an active filter, remove it
  if (activeKeywords.has(tag)) activeKeywords.delete(tag);
  saveState();
  buildKeywordChips();
  renderAddGrid();
}

// ===== LANE TAB SWITCH (ADD SCREEN) =====
function switchAddLane(lane) {
  currentAddLane = lane;
  document.querySelectorAll('.lane-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('lane-' + lane).classList.add('active');
  renderAddGrid();
  if (window.bumpVisitCount) window.bumpVisitCount();
}

function onAddSearch() {
  // Clear active keywords when typing
  if (document.getElementById('add-search').value) {
    activeKeywords.clear();
    buildKeywordChips();
  }
  updateClearBtn();
  renderAddGrid();
}

function clearAddSearch() {
  document.getElementById('add-search').value = '';
  activeKeywords.clear();
  updateClearBtn();
  buildKeywordChips();
  renderAddGrid();
}

function updateClearBtn() {
  const input = document.getElementById('add-search');
  const btn   = document.getElementById('btn-clear-search');
  if (!btn) return;
  btn.style.display = (input.value || activeKeywords.size > 0) ? 'flex' : 'none';
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

  if (activeKeywords.size > 0) {
    champs = champs.filter(c => {
      const tags = getEffectiveChampData(c.id).tags || [];
      for (const kw of activeKeywords) {
        if (!tags.includes(kw)) return false;
      }
      return true;
    });
  } else if (query) {
    champs = champs.filter(c => champMatchesQuery(c, query));
  }

  // Order: starred → selected junglers → selected non-junglers → unselected
  let selStarred   = champs.filter(c =>  state.pool.has(c.id) &&  state.starred.has(c.id));
  let selJungle    = champs.filter(c =>  state.pool.has(c.id) && !state.starred.has(c.id) &&  state.junglers.has(c.id));
  let selNonJungle = champs.filter(c =>  state.pool.has(c.id) && !state.starred.has(c.id) && !state.junglers.has(c.id));
  let unselected   = champs.filter(c => !state.pool.has(c.id));

  // "Starred only" wins over "Pool only" (starred is a subset of pool).
  if (filterStarredOnly) {
    selJungle = [];
    selNonJungle = [];
    unselected = [];
  } else if (filterPoolOnly) {
    unselected = [];
  }

  label.classList.toggle('hidden', selStarred.length === 0 && selJungle.length === 0 && selNonJungle.length === 0);
  const filterBar = document.getElementById('pool-filters');
  if (filterBar) filterBar.classList.toggle('hidden', selStarred.length === 0 && selJungle.length === 0 && selNonJungle.length === 0);

  grid.innerHTML = '';
  selStarred.forEach(c   => grid.appendChild(buildCard(c, 'add')));
  selJungle.forEach(c    => grid.appendChild(buildCard(c, 'add')));
  selNonJungle.forEach(c => grid.appendChild(buildCard(c, 'add')));
  unselected.forEach(c   => grid.appendChild(buildCard(c, 'add')));

}

function togglePoolFilter() {
  const el = document.getElementById('filter-pool-only');
  filterPoolOnly = !!(el && el.checked);
  if (filterPoolOnly) {
    filterStarredOnly = false;
    const other = document.getElementById('filter-starred-only');
    if (other) other.checked = false;
  }
  renderAddGrid();
}

function toggleStarredFilter() {
  const el = document.getElementById('filter-starred-only');
  filterStarredOnly = !!(el && el.checked);
  if (filterStarredOnly) {
    filterPoolOnly = false;
    const other = document.getElementById('filter-pool-only');
    if (other) other.checked = false;
  }
  renderAddGrid();
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

  const imgWrap = document.createElement('div');
  imgWrap.className = 'champ-img-wrap';
  if (ZOOM_2X_CHAMPS.has(champ.id)) imgWrap.classList.add('zoom-2x');
  if (typeof CHAMPION_ICON_OVERRIDES !== 'undefined' && CHAMPION_ICON_OVERRIDES[champ.id]) {
    imgWrap.classList.add('has-custom-art');
  }
  const xform = buildChampImgTransform(champ.id);
  if (xform) img.style.transform = xform;
  imgWrap.appendChild(img);

  const name = document.createElement('div');
  name.className = 'champ-name';
  if (champ.zhName) {
    name.innerHTML = `<span class="zh">${champ.zhName}</span><span class="en">${champ.name}</span>`;
  } else {
    name.textContent = champ.name;
  }

  card.appendChild(imgWrap);
  card.appendChild(name);

  if (mode === 'add' && inPool) {
    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = '✓';
    imgWrap.appendChild(badge);
  } else if (mode === 'add' && !inPool) {
    const hollow = document.createElement('div');
    hollow.className = 'card-badge-hollow';
    imgWrap.appendChild(hollow);
  }

  // Star button (pin to front) — only for champions in pool
  if (inPool) {
    const isStarred = state.starred.has(champ.id);
    const star = document.createElement('button');
    star.className = 'card-star' + (isStarred ? ' is-starred' : '');
    star.type = 'button';
    star.textContent = '★';
    star.title = isStarred ? t('unpin_title') : t('pin_title');
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStar(champ.id);
      if (mode === 'add') renderAddGrid();
      else renderPoolGrid();
    });
    imgWrap.appendChild(star);
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

// ===== UNDO / REDO (selection history) =====
const undoStack = [];
const redoStack = [];
const MAX_UNDO = 100;

function snapshotSelection() {
  return {
    pool:     [...state.pool],
    junglers: [...state.junglers],
    starred:  [...state.starred],
  };
}

function restoreSelection(snap) {
  state.pool     = new Set(snap.pool);
  state.junglers = new Set(snap.junglers);
  state.starred  = new Set(snap.starred);
}

function pushUndo() {
  undoStack.push(snapshotSelection());
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack.length = 0;
}

function rerenderAfterHistory() {
  saveState();
  if (document.getElementById('add-screen')?.classList.contains('active')) {
    renderAddGrid();
  }
  if (document.getElementById('pool-screen')?.classList.contains('active')) {
    renderPoolGrid();
  }
}

function undoSelection() {
  if (undoStack.length === 0) return;
  const current = snapshotSelection();
  const prev    = undoStack.pop();
  redoStack.push(current);
  restoreSelection(prev);
  rerenderAfterHistory();
}

function redoSelection() {
  if (redoStack.length === 0) return;
  const current = snapshotSelection();
  const next    = redoStack.pop();
  undoStack.push(current);
  restoreSelection(next);
  rerenderAfterHistory();
}

// ===== TOGGLE STAR (pin to front) =====
function toggleStar(id) {
  if (!state.pool.has(id)) return; // only pool members can be starred
  pushUndo();
  if (state.starred.has(id)) state.starred.delete(id);
  else state.starred.add(id);
  saveState();
}

// ===== TOGGLE POOL MEMBERSHIP =====
function togglePool(id) {
  pushUndo();
  if (state.pool.has(id)) {
    state.pool.delete(id);
    state.junglers.delete(id);
    state.starred.delete(id);
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
let hpTagPickerQuery     = '';
let hpCounterSearchOpen  = false;
let hpBeCounterSearchOpen = false;
let hpSynergySearchOpen  = false;
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
    if (!tooltipEl.contains(e.relatedTarget)) hpTimeout = setTimeout(hideHoverPanel, 2000);
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
  hpSynergySearchOpen   = false;
  renderHoverPanel(champ.id);
  tooltipEl.classList.remove('hidden');
  positionHoverPanel(cardEl);

  tooltipEl.onmouseenter = () => clearTimeout(hpTimeout);
  tooltipEl.onmouseleave = (e) => {
    if (!cardEl.contains(e.relatedTarget)) hpTimeout = setTimeout(hideHoverPanel, 2000);
  };
}

function positionHoverPanel(cardEl) {
  // Align to the img-wrap (the visible bordered square), not the inner <img>,
  // so the hover panel aligns to the card's actual image border instead of
  // shifting 1–2px inward when the highlight border thickens.
  const anchor = cardEl.querySelector('.champ-img-wrap') || cardEl.querySelector('img');
  const ref = anchor ? anchor.getBoundingClientRect() : cardEl.getBoundingClientRect();
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

// Reposition hover panel on scroll so it follows the source card (desktop).
// On touch devices, scrolling should dismiss the hover panel entirely —
// following it while the user is swiping feels laggy and gets in the way.
const isTouchDevice = window.matchMedia && window.matchMedia('(hover: none)').matches;
document.addEventListener('scroll', () => {
  if (!hpSourceCard || tooltipEl.classList.contains('hidden')) return;
  if (isTouchDevice) hideHoverPanel();
  else positionHoverPanel(hpSourceCard);
}, { passive: true, capture: true });

// Touch devices also fire touchmove on finger drag — dismiss the panel so
// it doesn't linger while the user is scrolling.
document.addEventListener('touchmove', () => {
  if (hpSourceCard && !tooltipEl.classList.contains('hidden')) hideHoverPanel();
}, { passive: true });

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
  const synergies  = data.synergies || [];
  // Hard rule: a champion cannot appear in both 克制 and 被克制
  const countersSet = new Set(counters);
  const beCountered = getBeCounteredBy(champId).filter(cc => !countersSet.has(cc.id));
  const displayName = champ.zhName
    ? (currentLang === 'en' ? `${champ.name} · ${champ.zhName}` : `${champ.zhName} · ${champ.name}`)
    : champ.name;

  // ── Tags section ──
  let tagsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">${t('hp_keywords')}</span>
    <button class="hp-plus-btn" onclick="toggleHpTagPicker()">+</button>
  </div>`;
  if (tags.length > 0) {
    tagsHtml += '<div class="hp-tags">';
    tags.forEach(tg => {
      tagsHtml += `<span class="hp-tag"><span class="hp-tag-link" onclick="hpClickTag('${tg}')">${displayTag(tg)}</span><button class="hp-tag-x" onclick="hpRemoveTag('${champId}','${tg}')">×</button></span>`;
    });
    tagsHtml += '</div>';
  } else if (!hpTagPickerOpen) {
    tagsHtml += `<div class="hp-empty">${t('hp_no_tags')}</div>`;
  }
  if (hpTagPickerOpen) {
    const unused = [...allKeywordTags()].filter(tg => !tags.includes(tg));
    const q = (hpTagPickerQuery || '').toLowerCase().trim();
    const available = q ? unused.filter(tg => tagMatchesQuery(tg, q)) : unused;
    tagsHtml += '<div class="hp-tag-picker-divider"></div>';
    tagsHtml += `<div class="hp-picker-label">${t('hp_available')}</div>`;
    tagsHtml += `<input type="text" class="hp-tag-search" id="hp-tag-search"
      placeholder="${t('hp_tag_search_ph')}" value="${hpTagPickerQuery.replace(/"/g, '&quot;')}"
      oninput="hpFilterTagPicker(this.value)"
      onclick="event.stopPropagation()">`;
    if (available.length > 0) {
      tagsHtml += '<div class="hp-tag-picker">';
      available.forEach(tg => {
        tagsHtml += `<button class="hp-tag-option" onclick="hpAddTag('${champId}','${tg}')">${displayTag(tg)}</button>`;
      });
      tagsHtml += '</div>';
    } else if (unused.length === 0) {
      tagsHtml += `<div class="hp-empty">${t('hp_all_tags_added')}</div>`;
    } else {
      tagsHtml += `<div class="hp-empty">${t('no_match')}</div>`;
    }
  }

  // ── counters section (this champ counters these) ──
  let ctrsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">${t('hp_counters')}</span>
    <button class="hp-plus-btn" onclick="toggleHpCounterSearch()">+</button>
  </div>`;
  if (counters.length > 0) {
    ctrsHtml += '<div class="hp-counters">';
    counters.forEach(cid => {
      const cc = ALL_CHAMPIONS.find(x => x.id === cid);
      if (!cc) return;
      ctrsHtml += `<div class="hp-counter-item">
        <img class="hp-nav-img" src="${getChampionIcon(cid, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'" onclick="hpNavigateToChamp('${cid}')">
        <span class="hp-nav-name" onclick="hpNavigateToChamp('${cid}')">${displayChampName(cc)}</span>
        <button class="hp-tag-x" onclick="hpRemoveCounter('${champId}','${cid}')">×</button>
      </div>`;
    });
    ctrsHtml += '</div>';
  } else if (!hpCounterSearchOpen) {
    ctrsHtml += `<div class="hp-empty">${t('hp_no_counters')}</div>`;
  }
  if (hpCounterSearchOpen) {
    ctrsHtml += `<input type="text" class="hp-counter-search" id="hp-counter-search"
      placeholder="${t('hp_search_champ')}" oninput="hpRenderCounterResults('${champId}',this.value)"
      onclick="event.stopPropagation()">
    <div id="hp-counter-results" class="hp-counter-results"></div>`;
  }

  // ── be-countered section (these champs counter this one) ──
  let beCtrsHtml = `<div class="hp-section-head">
    <span class="hp-section-title">${t('hp_be_countered')}</span>
    <button class="hp-plus-btn" onclick="toggleHpBeCounterSearch()">+</button>
  </div>`;
  if (beCountered.length > 0) {
    beCtrsHtml += '<div class="hp-counters">';
    beCountered.forEach(cc => {
      beCtrsHtml += `<div class="hp-counter-item">
        <img class="hp-nav-img" src="${getChampionIcon(cc.id, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'" onclick="hpNavigateToChamp('${cc.id}')">
        <span class="hp-nav-name" onclick="hpNavigateToChamp('${cc.id}')">${displayChampName(cc)}</span>
        <button class="hp-tag-x" onclick="hpRemoveBeCounter('${champId}','${cc.id}')">×</button>
      </div>`;
    });
    beCtrsHtml += '</div>';
  } else if (!hpBeCounterSearchOpen) {
    beCtrsHtml += `<div class="hp-empty">${t('hp_no_be_countered')}</div>`;
  }
  if (hpBeCounterSearchOpen) {
    beCtrsHtml += `<input type="text" class="hp-counter-search" id="hp-be-counter-search"
      placeholder="${t('hp_search_champ')}" oninput="hpRenderBeCounterResults('${champId}',this.value)"
      onclick="event.stopPropagation()">
    <div id="hp-be-counter-results" class="hp-counter-results"></div>`;
  }

  // ── synergy section (mutual — adding X syncs both sides) ──
  let synHtml = `<div class="hp-section-head">
    <span class="hp-section-title">${t('hp_synergy')}</span>
    <button class="hp-plus-btn" onclick="toggleHpSynergySearch()">+</button>
  </div>`;
  if (synergies.length > 0) {
    synHtml += '<div class="hp-counters">';
    synergies.forEach(sid => {
      const cc = ALL_CHAMPIONS.find(x => x.id === sid);
      if (!cc) return;
      synHtml += `<div class="hp-counter-item">
        <img class="hp-nav-img" src="${getChampionIcon(sid, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'" onclick="hpNavigateToChamp('${sid}')">
        <span class="hp-nav-name" onclick="hpNavigateToChamp('${sid}')">${displayChampName(cc)}</span>
        <button class="hp-tag-x" onclick="hpRemoveSynergy('${champId}','${sid}')">×</button>
      </div>`;
    });
    synHtml += '</div>';
  } else if (!hpSynergySearchOpen) {
    synHtml += `<div class="hp-empty">${t('hp_no_synergy')}</div>`;
  }
  if (hpSynergySearchOpen) {
    synHtml += `<input type="text" class="hp-counter-search" id="hp-synergy-search"
      placeholder="${t('hp_search_champ')}" oninput="hpRenderSynergyResults('${champId}',this.value)"
      onclick="event.stopPropagation()">
    <div id="hp-synergy-results" class="hp-counter-results"></div>`;
  }

  tooltipEl.innerHTML = `
    <div class="hp-champ-header">${displayName}</div>
    <div class="hp-section">${tagsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-hint"><span class="hp-hint-label">${t('hp_hint_comp_label')}</span><br>${t('hp_hint_comp')}</div>
    <div class="hp-divider"></div>
    <div class="hp-section">${ctrsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-section">${beCtrsHtml}</div>
    <div class="hp-divider"></div>
    <div class="hp-hint"><span class="hp-hint-label">${t('hp_hint_chain_label')}</span><br>${t('hp_hint_chain')}</div>
    <div class="hp-divider"></div>
    <div class="hp-section">${synHtml}</div>
  `;

  const focusId = hpCounterSearchOpen ? 'hp-counter-search'
    : hpBeCounterSearchOpen ? 'hp-be-counter-search'
    : hpSynergySearchOpen ? 'hp-synergy-search'
    : (hpTagPickerOpen && !hpTagPickerQuery) ? 'hp-tag-search'
    : null;
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
  hpSynergySearchOpen   = false;
  if (!hpTagPickerOpen) hpTagPickerQuery = '';
  renderHoverPanel(currentCardPanelId);
}

// Update filter query and rebuild only the available-tags list in place,
// so the text input keeps focus and caret position without a full re-render.
function hpFilterTagPicker(query) {
  hpTagPickerQuery = query || '';
  if (!currentCardPanelId) return;
  const q = hpTagPickerQuery.toLowerCase().trim();
  const data = getEffectiveChampData(currentCardPanelId);
  const tags = data.tags || [];
  const unused = [...allKeywordTags()].filter(tg => !tags.includes(tg));
  const available = q ? unused.filter(tg => tagMatchesQuery(tg, q)) : unused;

  // Replace the picker grid (or the "no match" / "all added" empty state)
  const input = document.getElementById('hp-tag-search');
  if (!input) return;
  let next = input.nextElementSibling;
  while (next && (next.classList.contains('hp-tag-picker') || next.classList.contains('hp-empty'))) {
    const toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }
  const champId = currentCardPanelId;
  let html = '';
  if (available.length > 0) {
    html = '<div class="hp-tag-picker">' +
      available.map(tg => `<button class="hp-tag-option" onclick="hpAddTag('${champId}','${tg}')">${displayTag(tg)}</button>`).join('') +
      '</div>';
  } else if (unused.length === 0) {
    html = `<div class="hp-empty">${t('hp_all_tags_added')}</div>`;
  } else {
    html = `<div class="hp-empty">${t('no_match')}</div>`;
  }
  input.insertAdjacentHTML('afterend', html);
}

function toggleHpCounterSearch() {
  hpCounterSearchOpen   = !hpCounterSearchOpen;
  hpTagPickerOpen       = false;
  hpBeCounterSearchOpen = false;
  hpSynergySearchOpen   = false;
  renderHoverPanel(currentCardPanelId);
}

function toggleHpBeCounterSearch() {
  hpBeCounterSearchOpen = !hpBeCounterSearchOpen;
  hpTagPickerOpen       = false;
  hpCounterSearchOpen   = false;
  hpSynergySearchOpen   = false;
  renderHoverPanel(currentCardPanelId);
}

function toggleHpSynergySearch() {
  hpSynergySearchOpen   = !hpSynergySearchOpen;
  hpTagPickerOpen       = false;
  hpCounterSearchOpen   = false;
  hpBeCounterSearchOpen = false;
  renderHoverPanel(currentCardPanelId);
}

function hpAddTag(champId, tag) {
  const data = ensureChampDataOverride(champId);
  if (!data.tags.includes(tag)) {
    data.tags.push(tag);
    saveState();
  }
  hpTagPickerOpen = false;
  hpTagPickerQuery = '';
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
      <span>${displayChampName(cc)}</span>`;
    row.onclick = (e) => { e.stopPropagation(); hpAddCounter(champId, cc.id); };
    results.appendChild(row);
  });
  if (candidates.length === 0) results.innerHTML = `<div class="hp-empty">${t('no_match')}</div>`;
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
      <span>${displayChampName(cc)}</span>`;
    row.onclick = (e) => { e.stopPropagation(); hpAddBeCounter(champId, cc.id); };
    results.appendChild(row);
  });
  if (candidates.length === 0) results.innerHTML = `<div class="hp-empty">${t('no_match')}</div>`;
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

// ── 配合 (Synergy) functions ── mutual: both sides' synergies lists get updated
function hpRenderSynergyResults(champId, query) {
  const results = document.getElementById('hp-synergy-results');
  if (!results) return;
  const q = query.toLowerCase().trim();
  if (!q) { results.innerHTML = ''; return; }
  const existing = new Set((getEffectiveChampData(champId) || {}).synergies || []);
  const candidates = ALL_CHAMPIONS.filter(c => {
    if (c.id === champId || existing.has(c.id)) return false;
    return c.name.toLowerCase().includes(q) || (c.zhName && c.zhName.includes(q));
  }).slice(0, 12);
  results.innerHTML = '';
  candidates.forEach(cc => {
    const row = document.createElement('div');
    row.className = 'hp-result-row';
    row.innerHTML = `<img src="${getChampionIcon(cc.id, cc.wrOnly)}" alt="" onerror="this.src='${PLACEHOLDER_IMG}'">
      <span>${displayChampName(cc)}</span>`;
    row.onclick = (e) => { e.stopPropagation(); hpAddSynergy(champId, cc.id); };
    results.appendChild(row);
  });
  if (candidates.length === 0) results.innerHTML = `<div class="hp-empty">${t('no_match')}</div>`;
}

function hpAddSynergy(champId, partnerId) {
  const a = ensureChampDataOverride(champId);
  const b = ensureChampDataOverride(partnerId);
  if (!a.synergies.includes(partnerId)) a.synergies.push(partnerId);
  if (!b.synergies.includes(champId))   b.synergies.push(champId);
  saveState();
  const inp = document.getElementById('hp-synergy-search');
  const val = inp ? inp.value : '';
  renderHoverPanel(champId);
  setTimeout(() => {
    const newInp = document.getElementById('hp-synergy-search');
    if (newInp) { newInp.value = val; hpRenderSynergyResults(champId, val); newInp.focus(); }
  }, 10);
}

function hpRemoveSynergy(champId, partnerId) {
  const a = ensureChampDataOverride(champId);
  const b = ensureChampDataOverride(partnerId);
  a.synergies = (a.synergies || []).filter(x => x !== partnerId);
  b.synergies = (b.synergies || []).filter(x => x !== champId);
  saveState();
  renderHoverPanel(champId);
}

// ── Navigation from hover panel ──

// Click a tag → activate keyword filter and show matching champions
function hpClickTag(tag) {
  hideHoverPanel();
  activeKeywords.clear();
  activeKeywords.add(tag);
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
  activeKeywords.clear();
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
  document.getElementById('modal-champ-name').textContent = displayChampName(champ);

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
    pill.innerHTML = `<span>${displayTag(tag)}</span><button onclick="removeTag(${i})" title="${t('delete')}">×</button>`;
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
      <span class="cpill-name">${displayChampName(cc)}</span>
      <button class="cpill-remove" onclick="removeCounter('${cid}')" title="${t('remove')}">×</button>`;

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
      <span>${displayChampName(cc)}</span>`;
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
  pushUndo();
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
  const name  = champ ? displayChampName(champ) : editingChampId;
  if (!confirm(t('confirm_remove', name))) return;

  pushUndo();
  state.pool.delete(editingChampId);
  state.junglers.delete(editingChampId);
  state.starred.delete(editingChampId);
  saveState();
  closeModal();
}

// ===== KEYBOARD SHORTCUTS =====
// Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z (or Cmd/Ctrl+Y) redo — for selection history
document.addEventListener('keydown', e => {
  const tag = (e.target && e.target.tagName) || '';
  const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
  if (isEditable) return;

  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return;
  const key = e.key.toLowerCase();

  if (key === 'z') {
    e.preventDefault();
    if (e.shiftKey) redoSelection();
    else undoSelection();
  } else if (key === 'y') {
    e.preventDefault();
    redoSelection();
  }
});

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

// Hide hover panel on ANY click outside the tooltip itself.
// Covers keyword chips, lane tabs, champion cards, toggles, etc.
document.addEventListener('click', e => {
  if (tooltipEl && !tooltipEl.contains(e.target)) {
    hideHoverPanel();
  }
}, true);

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

// ===== EXPORT DEFAULT DATA =====
// Merges current localStorage overrides into DEFAULT_CHAMP_DATA and downloads
// an updated copy of js/champions-data.js ready to commit.
function exportDefaultData() {
  const merged = getEffectiveChampDataMap();

  const ids = Object.keys(merged).sort((a, b) => a.localeCompare(b));
  const nameCol = Math.max(...ids.map(id => id.length)) + 1;
  const strArr = arr => '[' + arr.map(s => JSON.stringify(s)).join(',') + ']';
  const lines = [];
  for (const id of ids) {
    const d = merged[id] || {};
    const tags = (d.tags || []).length ? d.tags : null;
    const counters = (d.counters || []).length ? d.counters : null;
    const synergies = (d.synergies || []).length ? d.synergies : null;
    if (!tags && !counters && !synergies) continue;
    const parts = [];
    if (tags) parts.push(`tags: ${strArr(tags)}`);
    if (counters) parts.push(`counters: ${strArr(counters)}`);
    if (synergies) parts.push(`synergies: ${strArr(synergies)}`);
    const pad = ' '.repeat(nameCol - id.length);
    lines.push(`  ${id}:${pad}{ ${parts.join(', ')} },`);
  }
  const newBlock = 'const DEFAULT_CHAMP_DATA = {\n' + lines.join('\n') + '\n};';

  fetch('js/champions-data.js')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(src => {
      const startIdx = src.indexOf('const DEFAULT_CHAMP_DATA');
      if (startIdx < 0) throw new Error('DEFAULT_CHAMP_DATA not found in source');
      const braceStart = src.indexOf('{', startIdx);
      let depth = 0, endIdx = -1;
      for (let i = braceStart; i < src.length; i++) {
        const ch = src[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) {
            const semi = src.indexOf(';', i);
            endIdx = (semi >= 0 && semi < i + 3) ? semi + 1 : i + 1;
            break;
          }
        }
      }
      if (endIdx < 0) throw new Error('Could not find end of DEFAULT_CHAMP_DATA block');

      const updated = src.slice(0, startIdx) + newBlock + src.slice(endIdx);
      const blob = new Blob([updated], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'champions-data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      alert('Export failed: ' + err.message +
        '\n\nTip: requires loading the page over http:// (not file://). ' +
        'Run e.g. `python3 -m http.server 8000` in the project root.');
    });
}

// ===== INIT =====
applyI18n();
loadState();
refreshStoredOverrides();
buildKeywordChips();
renderAddGrid();
