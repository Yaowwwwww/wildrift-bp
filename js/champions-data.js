// Wild Rift Champion Master List
// Source: https://wildrift.leagueoflegends.com/en-us/champions/ (April 2026)
// Images via Riot Data Dragon CDN (version fetched dynamically at runtime)
let DDRAGON_VERSION = "15.6.1"; // fallback; updated on load

// Fetch latest DDragon version so newer champs (Mel, Smolder, etc.) load correctly
fetch("https://ddragon.leagueoflegends.com/api/versions.json")
  .then(r => r.json())
  .then(v => { DDRAGON_VERSION = v[0]; })
  .catch(() => {}); // keep fallback on failure

// Per-champion image overrides (WR-exclusive or custom sources)
// Champions whose Data Dragon file name differs from our ID
const DDRAGON_ID_MAP = {
  Wukong: "MonkeyKing",
};

// Per-champion image overrides (WR-exclusive champions with no DDragon asset)
const CHAMPION_ICON_OVERRIDES = {
  Norra: "https://www.wildriftfire.com/images/champion/icon/norra.png",
};

function getChampionIcon(id, wrOnly) {
  if (CHAMPION_ICON_OVERRIDES[id]) return CHAMPION_ICON_OVERRIDES[id];
  if (wrOnly) return PLACEHOLDER_IMG;
  const ddId = DDRAGON_ID_MAP[id] || id;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${ddId}.png`;
}

// ===== CHAMPION LANE DATA =====
// Source: wildriftfire.com Patch 7.1
const LANE_DATA = {
  baron: [
    "Aatrox","Fiora","Ambessa","Camille","Annie","Kassadin","Nautilus","Pyke",
    "Ornn","Swain","Rumble","Poppy","Malphite","Shen","Sion","Riven","Jax",
    "Renekton","Gwen","Gnar","Wukong","Heimerdinger","Irelia","Darius","Yone",
    "Yasuo","Nasus","Garen","Teemo","Vladimir","Galio","Warwick","Singed",
    "Volibear","Ryze","Sett","Mordekaiser","Olaf","Jayce","Tryndamere","Kayle",
    "Urgot","DrMundo","Ekko","Diana","Talon","Kennen","Maokai","Pantheon","Fizz",
    "Zyra","Zoe","Samira","Seraphine","Soraka","Milio","Sona"
  ],
  jungle: [
    "Nidalee","Aatrox","Viego","Riven","Rammus","Amumu","Shyvana","MasterYi",
    "Vi","JarvanIV","XinZhao","Kindred","LeeSin","Warwick","Hecarim","Lillia",
    "Rengar","Evelynn","Talon","Khazix","Fiddlesticks","Pantheon","Kayn","Nunu",
    "Wukong","Ekko","Olaf","Diana","Nocturne","Gragas","Camille","Mordekaiser",
    "Poppy","Thresh","Yone","Nilah","Morgana","Ziggs","Darius","Tryndamere",
    "Volibear","Graves","Maokai","Gwen","Fizz","Ambessa"
  ],
  mid: [
    "Orianna","Syndra","Annie","Kassadin","Swain","Zyra","Ryze","AurelionSol",
    "Viktor","Smolder","Heimerdinger","TwistedFate","Kennen","Akali","Brand",
    "Morgana","Yone","Yasuo","Teemo","Zoe","Vladimir","Velkoz","Veigar","Jayce",
    "Zed","Gragas","Akshan","Irelia","Galio","Ziggs","Lux","Katarina","Seraphine",
    "Karma","Fizz","Kayle","Ekko","Diana","Talon","Mel","Norra","Aurora","Ahri"
  ],
  adc: [
    "Smolder","Xayah","MissFortune","Ezreal","Lucian","Vayne","Kaisa","KogMaw",
    "Jhin","Draven","Corki","Caitlyn","Tristana","Twitch","Samira","Zeri",
    "Nilah","Ashe","Kalista","Varus","Jinx","Sivir"
  ],
  support: [
    "Nami","Braum","Zilean","Nautilus","Pyke","Ornn","Milio","Senna","Rakan",
    "Leona","Maokai","Karma","Janna","Lulu","Zyra","Galio","Nunu","Blitzcrank",
    "Alistar","Bard","Lux","Rell","Yuumi","Thresh","Brand","Swain","Morgana",
    "Soraka","Seraphine","Sona"
  ],
};

// Champions auto-marked as junglers when added to pool
// Source: wildriftfire.com tier list Patch 7.1 jungle role
const DEFAULT_JUNGLERS = [
  "Nidalee", "Aatrox", "Viego", "Riven", "Rammus", "Amumu",
  "Shyvana", "MasterYi", "Vi", "JarvanIV", "XinZhao", "Kindred",
  "LeeSin", "Warwick", "Hecarim", "Lillia", "Rengar", "Evelynn",
  "Ambessa", "Nunu", "Wukong", "Talon", "Khazix", "Fiddlesticks",
  "Pantheon", "Kayn", "Zed", "Nocturne", "Gragas", "Ekko",
  "Olaf", "Diana", "Camille", "Fiora", "Irelia", "Poppy",
  "Yone", "Nilah", "Morgana", "Darius", "Tryndamere", "Volibear",
  "Graves", "Maokai", "Mordekaiser", "Gwen", "Fizz",
];

// All 137 Wild Rift champions (official list)
// zhName = official Chinese name
const ALL_CHAMPIONS = [
  { id: "Aatrox",       name: "Aatrox",        zhName: "剑魔" },
  { id: "Ahri",         name: "Ahri",          zhName: "阿狸" },
  { id: "Akali",        name: "Akali",         zhName: "阿卡丽" },
  { id: "Akshan",       name: "Akshan",        zhName: "阿克尚" },
  { id: "Alistar",      name: "Alistar",       zhName: "阿利斯塔" },
  { id: "Ambessa",      name: "Ambessa",       zhName: "安贝莎" },
  { id: "Amumu",        name: "Amumu",         zhName: "阿木木" },
  { id: "Annie",        name: "Annie",         zhName: "安妮" },
  { id: "Ashe",         name: "Ashe",          zhName: "艾希" },
  { id: "AurelionSol",  name: "Aurelion Sol",  zhName: "奥瑞利安·索尔" },
  { id: "Aurora",       name: "Aurora",        zhName: "奥罗拉" },
  { id: "Bard",         name: "Bard",          zhName: "巴德" },
  { id: "Blitzcrank",   name: "Blitzcrank",    zhName: "布里茨" },
  { id: "Brand",        name: "Brand",         zhName: "布兰德" },
  { id: "Braum",        name: "Braum",         zhName: "布劳姆" },
  { id: "Caitlyn",      name: "Caitlyn",       zhName: "凯特琳" },
  { id: "Camille",      name: "Camille",       zhName: "卡蜜尔" },
  { id: "Corki",        name: "Corki",         zhName: "科基" },
  { id: "Darius",       name: "Darius",        zhName: "德莱厄斯" },
  { id: "Diana",        name: "Diana",         zhName: "戴安娜" },
  { id: "DrMundo",      name: "Dr. Mundo",     zhName: "蒙多医生" },
  { id: "Draven",       name: "Draven",        zhName: "德莱文" },
  { id: "Ekko",         name: "Ekko",          zhName: "艾克" },
  { id: "Evelynn",      name: "Evelynn",       zhName: "伊芙琳" },
  { id: "Ezreal",       name: "Ezreal",        zhName: "伊泽瑞尔" },
  { id: "Fiddlesticks", name: "Fiddlesticks",  zhName: "菲德提克" },
  { id: "Fiora",        name: "Fiora",         zhName: "菲欧娜" },
  { id: "Fizz",         name: "Fizz",          zhName: "菲兹" },
  { id: "Galio",        name: "Galio",         zhName: "加里奥" },
  { id: "Garen",        name: "Garen",         zhName: "盖伦" },
  { id: "Gnar",         name: "Gnar",          zhName: "纳尔" },
  { id: "Gragas",       name: "Gragas",        zhName: "格雷戈斯" },
  { id: "Graves",       name: "Graves",        zhName: "格雷福斯" },
  { id: "Gwen",         name: "Gwen",          zhName: "格温" },
  { id: "Hecarim",      name: "Hecarim",       zhName: "赫卡里姆" },
  { id: "Heimerdinger", name: "Heimerdinger",  zhName: "海默丁格" },
  { id: "Irelia",       name: "Irelia",        zhName: "艾瑞利亚" },
  { id: "Janna",        name: "Janna",         zhName: "迦娜" },
  { id: "JarvanIV",     name: "Jarvan IV",     zhName: "嘉文四世" },
  { id: "Jax",          name: "Jax",           zhName: "贾克斯" },
  { id: "Jayce",        name: "Jayce",         zhName: "杰斯" },
  { id: "Jhin",         name: "Jhin",          zhName: "烬" },
  { id: "Jinx",         name: "Jinx",          zhName: "金克丝" },
  { id: "KSante",       name: "K'Sante",       zhName: "克桑特" },
  { id: "Kaisa",        name: "Kai'Sa",        zhName: "卡莎" },
  { id: "Kalista",      name: "Kalista",       zhName: "卡利斯塔" },
  { id: "Karma",        name: "Karma",         zhName: "卡尔玛" },
  { id: "Kassadin",     name: "Kassadin",      zhName: "卡萨丁" },
  { id: "Katarina",     name: "Katarina",      zhName: "卡特琳娜" },
  { id: "Kayle",        name: "Kayle",         zhName: "凯尔" },
  { id: "Kayn",         name: "Kayn",          zhName: "凯隐" },
  { id: "Kennen",       name: "Kennen",        zhName: "凯南" },
  { id: "Khazix",       name: "Kha'Zix",       zhName: "卡兹克" },
  { id: "Kindred",      name: "Kindred",       zhName: "千珏" },
  { id: "KogMaw",       name: "Kog'Maw",       zhName: "科加斯" },
  { id: "LeeSin",       name: "Lee Sin",       zhName: "李青" },
  { id: "Leona",        name: "Leona",         zhName: "莱欧娜" },
  { id: "Lillia",       name: "Lillia",        zhName: "莉莉娅" },
  { id: "Lissandra",    name: "Lissandra",     zhName: "莉桑卓" },
  { id: "Lucian",       name: "Lucian",        zhName: "卢锡安" },
  { id: "Lulu",         name: "Lulu",          zhName: "露露" },
  { id: "Lux",          name: "Lux",           zhName: "拉克丝" },
  { id: "Malphite",     name: "Malphite",      zhName: "墨菲特" },
  { id: "Maokai",       name: "Maokai",        zhName: "茂凯" },
  { id: "MasterYi",     name: "Master Yi",     zhName: "易大师" },
  { id: "Mel",          name: "Mel",           zhName: "梅尔" },
  { id: "Milio",        name: "Milio",         zhName: "米利欧" },
  { id: "MissFortune",  name: "Miss Fortune",  zhName: "赏金猎人" },
  { id: "Mordekaiser",  name: "Mordekaiser",   zhName: "莫德凯撒" },
  { id: "Morgana",      name: "Morgana",       zhName: "莫甘娜" },
  { id: "Nami",         name: "Nami",          zhName: "娜美" },
  { id: "Nasus",        name: "Nasus",         zhName: "纳沙斯" },
  { id: "Nautilus",     name: "Nautilus",      zhName: "鹦鹉螺" },
  { id: "Nidalee",      name: "Nidalee",       zhName: "奈达丽" },
  { id: "Nilah",        name: "Nilah",         zhName: "妮菈" },
  { id: "Nocturne",     name: "Nocturne",      zhName: "梦魇" },
  { id: "Norra",        name: "Norra",         zhName: "诺拉", wrOnly: true },
  { id: "Nunu",         name: "Nunu & Willump",zhName: "努努和威朗普" },
  { id: "Olaf",         name: "Olaf",          zhName: "奥拉夫" },
  { id: "Orianna",      name: "Orianna",       zhName: "奥利安娜" },
  { id: "Ornn",         name: "Ornn",          zhName: "奥恩" },
  { id: "Pantheon",     name: "Pantheon",      zhName: "潘森" },
  { id: "Poppy",        name: "Poppy",         zhName: "波比" },
  { id: "Pyke",         name: "Pyke",          zhName: "派克" },
  { id: "Rakan",        name: "Rakan",         zhName: "拉坎" },
  { id: "Rammus",       name: "Rammus",        zhName: "兰博" },
  { id: "Rell",         name: "Rell",          zhName: "蕾尔" },
  { id: "Renekton",     name: "Renekton",      zhName: "雷克顿" },
  { id: "Rengar",       name: "Rengar",        zhName: "雷恩加尔" },
  { id: "Riven",        name: "Riven",         zhName: "锐雯" },
  { id: "Rumble",       name: "Rumble",        zhName: "兰伯斯" },
  { id: "Ryze",         name: "Ryze",          zhName: "瑞兹" },
  { id: "Samira",       name: "Samira",        zhName: "萨米拉" },
  { id: "Senna",        name: "Senna",         zhName: "赛娜" },
  { id: "Seraphine",    name: "Seraphine",     zhName: "瑟菈芬" },
  { id: "Sett",         name: "Sett",          zhName: "瑟特" },
  { id: "Shen",         name: "Shen",          zhName: "慎" },
  { id: "Shyvana",      name: "Shyvana",       zhName: "希瓦娜" },
  { id: "Singed",       name: "Singed",        zhName: "辛吉德" },
  { id: "Sion",         name: "Sion",          zhName: "赛恩" },
  { id: "Sivir",        name: "Sivir",         zhName: "希维尔" },
  { id: "Smolder",      name: "Smolder",       zhName: "斯摩德" },
  { id: "Sona",         name: "Sona",          zhName: "娑娜" },
  { id: "Soraka",       name: "Soraka",        zhName: "索拉卡" },
  { id: "Swain",        name: "Swain",         zhName: "斯威因" },
  { id: "Syndra",       name: "Syndra",        zhName: "辛德拉" },
  { id: "Talon",        name: "Talon",         zhName: "泰隆" },
  { id: "Teemo",        name: "Teemo",         zhName: "提莫" },
  { id: "Thresh",       name: "Thresh",        zhName: "锤石" },
  { id: "Tristana",     name: "Tristana",      zhName: "崔丝塔娜" },
  { id: "Tryndamere",   name: "Tryndamere",    zhName: "崔斯特" },
  { id: "TwistedFate",  name: "Twisted Fate",  zhName: "卡牌大师" },
  { id: "Twitch",       name: "Twitch",        zhName: "特维奇" },
  { id: "Urgot",        name: "Urgot",         zhName: "厄加特" },
  { id: "Varus",        name: "Varus",         zhName: "维鲁斯" },
  { id: "Vayne",        name: "Vayne",         zhName: "薇恩" },
  { id: "Veigar",       name: "Veigar",        zhName: "维迦" },
  { id: "Velkoz",       name: "Vel'Koz",       zhName: "维尔科兹" },
  { id: "Vex",          name: "Vex",           zhName: "薇克斯" },
  { id: "Vi",           name: "Vi",            zhName: "蔚" },
  { id: "Viego",        name: "Viego",         zhName: "佛耶戈" },
  { id: "Viktor",       name: "Viktor",        zhName: "维克托" },
  { id: "Vladimir",     name: "Vladimir",      zhName: "弗拉基米尔" },
  { id: "Volibear",     name: "Volibear",      zhName: "沃利贝尔" },
  { id: "Warwick",      name: "Warwick",       zhName: "华威" },
  { id: "Wukong",       name: "Wukong",        zhName: "孙悟空" },
  { id: "Xayah",        name: "Xayah",         zhName: "霞" },
  { id: "XinZhao",      name: "Xin Zhao",      zhName: "赵信" },
  { id: "Yasuo",        name: "Yasuo",         zhName: "亚索" },
  { id: "Yone",         name: "Yone",          zhName: "永恩" },
  { id: "Yuumi",        name: "Yuumi",         zhName: "悠米" },
  { id: "Zed",          name: "Zed",           zhName: "劫" },
  { id: "Zeri",         name: "Zeri",          zhName: "泽丽" },
  { id: "Ziggs",        name: "Ziggs",         zhName: "吉格斯" },
  { id: "Zilean",       name: "Zilean",        zhName: "基兰" },
  { id: "Zoe",          name: "Zoe",           zhName: "佐伊" },
  { id: "Zyra",         name: "Zyra",          zhName: "扎拉" },
].sort((a, b) => a.name.localeCompare(b.name));

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23181818'/%3E%3Ctext x='50%25' y='50%25' font-size='28' fill='%23444' text-anchor='middle' dy='.35em'%3E%3F%3C/text%3E%3C/svg%3E";

// ===== DEFAULT CHAMPION DATA =====
// Counter direction: X.counters = [A, B]  means  X 克制 A 和 B
// Tags: situational keywords for picking
//
// 中文名对照：
//   波比=Poppy  蔚=Vi  盲僧=LeeSin  龙龟=Rammus  千珏/狼母=Kindred
//   赵信=XinZhao  人马=Hecarim  佛耶戈=Viego  泰坦=Nautilus  莉莉娅=Lillia
//   格温=Gwen  剑圣=MasterYi  贾克斯=Jax  酒桶=Gragas  螳螂=Khazix
//   龙女=Shyvana  诺手=Nasus  皎月=Diana  梦魇=Nocturne  豹女=Nidalee
// DEFAULT_CHAMP_DATA is defined in user-data.js (gitignored locally)
