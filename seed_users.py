// ============================================================
//  QUINIELA MUNDIAL 2026 - Partidos Fase de Grupos
//  Horarios en hora de El Salvador (UTC-6)
//  matches-data.js
// ============================================================

const MATCHES_GROUP_STAGE = [
  // ── 11 de junio ──
  { id:"m001", date:"2026-06-11", time:"13:00", home:"M\u00e9xico",       away:"Sud\u00e1frica",     group:"A", stage:"grupo" },
  { id:"m002", date:"2026-06-11", time:"20:00", home:"Corea del Sur",     away:"Chequia",            group:"B", stage:"grupo" },
  // ── 12 de junio ──
  { id:"m003", date:"2026-06-12", time:"13:00", home:"Canad\u00e1",       away:"Bosnia",             group:"C", stage:"grupo" },
  { id:"m004", date:"2026-06-12", time:"19:00", home:"Estados Unidos",    away:"Paraguay",           group:"D", stage:"grupo" },
  // ── 13 de junio ──
  { id:"m005", date:"2026-06-13", time:"13:00", home:"Catar",             away:"Suiza",              group:"E", stage:"grupo" },
  { id:"m006", date:"2026-06-13", time:"16:00", home:"Brasil",            away:"Marruecos",          group:"F", stage:"grupo" },
  { id:"m007", date:"2026-06-13", time:"19:00", home:"Hait\u00ed",        away:"Escocia",            group:"G", stage:"grupo" },
  { id:"m008", date:"2026-06-13", time:"22:00", home:"Australia",         away:"Turqu\u00eda",       group:"H", stage:"grupo" },
  // ── 14 de junio ──
  { id:"m009", date:"2026-06-14", time:"11:00", home:"Alemania",          away:"Curazao",            group:"I", stage:"grupo" },
  { id:"m010", date:"2026-06-14", time:"14:00", home:"Pa\u00edses Bajos", away:"Jap\u00f3n",         group:"J", stage:"grupo" },
  { id:"m011", date:"2026-06-14", time:"17:00", home:"Costa de Marfil",   away:"Ecuador",            group:"K", stage:"grupo" },
  { id:"m012", date:"2026-06-14", time:"20:00", home:"Suecia",            away:"T\u00fanez",         group:"L", stage:"grupo" },
  // ── 15 de junio ──
  { id:"m013", date:"2026-06-15", time:"10:00", home:"Espa\u00f1a",       away:"Cabo Verde",         group:"A", stage:"grupo" },
  { id:"m014", date:"2026-06-15", time:"13:00", home:"B\u00e9lgica",      away:"Egipto",             group:"B", stage:"grupo" },
  { id:"m015", date:"2026-06-15", time:"16:00", home:"Arabia Saudita",    away:"Uruguay",            group:"C", stage:"grupo" },
  { id:"m016", date:"2026-06-15", time:"19:00", home:"Ir\u00e1n",         away:"Nueva Zelanda",      group:"D", stage:"grupo" },
  // ── 16 de junio ──
  { id:"m017", date:"2026-06-16", time:"13:00", home:"Francia",           away:"Senegal",            group:"E", stage:"grupo" },
  { id:"m018", date:"2026-06-16", time:"16:00", home:"Irak",              away:"Noruega",            group:"F", stage:"grupo" },
  { id:"m019", date:"2026-06-16", time:"19:00", home:"Argentina",         away:"Argelia",            group:"G", stage:"grupo" },
  { id:"m020", date:"2026-06-16", time:"22:00", home:"Austria",           away:"Jordania",           group:"H", stage:"grupo" },
  // ── 17 de junio ──
  { id:"m021", date:"2026-06-17", time:"11:00", home:"Portugal",          away:"RD Congo",           group:"I", stage:"grupo" },
  { id:"m022", date:"2026-06-17", time:"14:00", home:"Inglaterra",        away:"Croacia",            group:"J", stage:"grupo" },
  { id:"m023", date:"2026-06-17", time:"17:00", home:"Ghana",             away:"Panam\u00e1",        group:"K", stage:"grupo" },
  { id:"m024", date:"2026-06-17", time:"20:00", home:"Uzbekist\u00e1n",   away:"Colombia",           group:"L", stage:"grupo" },
  // ── 18 de junio ──
  { id:"m025", date:"2026-06-18", time:"10:00", home:"Chequia",           away:"Sud\u00e1frica",     group:"B", stage:"grupo" },
  { id:"m026", date:"2026-06-18", time:"13:00", home:"Suiza",             away:"Bosnia",             group:"E", stage:"grupo" },
  { id:"m027", date:"2026-06-18", time:"16:00", home:"Canad\u00e1",       away:"Catar",              group:"C", stage:"grupo" },
  { id:"m028", date:"2026-06-18", time:"19:00", home:"M\u00e9xico",       away:"Corea del Sur",      group:"A", stage:"grupo" },
  // ── 19 de junio ──
  { id:"m029", date:"2026-06-19", time:"13:00", home:"Estados Unidos",    away:"Australia",          group:"D", stage:"grupo" },
  { id:"m030", date:"2026-06-19", time:"16:00", home:"Escocia",           away:"Marruecos",          group:"F", stage:"grupo" },
  { id:"m031", date:"2026-06-19", time:"18:30", home:"Brasil",            away:"Hait\u00ed",         group:"G", stage:"grupo" },
  { id:"m032", date:"2026-06-19", time:"21:00", home:"Turqu\u00eda",      away:"Paraguay",           group:"H", stage:"grupo" },
  // ── 20 de junio ──
  { id:"m033", date:"2026-06-20", time:"11:00", home:"Pa\u00edses Bajos", away:"Suecia",             group:"J", stage:"grupo" },
  { id:"m034", date:"2026-06-20", time:"14:00", home:"Alemania",          away:"Costa de Marfil",    group:"I", stage:"grupo" },
  { id:"m035", date:"2026-06-20", time:"18:00", home:"Ecuador",           away:"Curazao",            group:"K", stage:"grupo" },
  { id:"m036", date:"2026-06-20", time:"22:00", home:"T\u00fanez",        away:"Jap\u00f3n",         group:"L", stage:"grupo" },
  // ── 21 de junio ──
  { id:"m037", date:"2026-06-21", time:"10:00", home:"Espa\u00f1a",       away:"Arabia Saudita",     group:"A", stage:"grupo" },
  { id:"m038", date:"2026-06-21", time:"13:00", home:"B\u00e9lgica",      away:"Ir\u00e1n",          group:"B", stage:"grupo" },
  { id:"m039", date:"2026-06-21", time:"16:00", home:"Uruguay",           away:"Cabo Verde",         group:"C", stage:"grupo" },
  { id:"m040", date:"2026-06-21", time:"19:00", home:"Nueva Zelanda",     away:"Egipto",             group:"D", stage:"grupo" },
  // ── 22 de junio ──
  { id:"m041", date:"2026-06-22", time:"11:00", home:"Argentina",         away:"Austria",            group:"G", stage:"grupo" },
  { id:"m042", date:"2026-06-22", time:"15:00", home:"Francia",           away:"Irak",               group:"E", stage:"grupo" },
  { id:"m043", date:"2026-06-22", time:"18:00", home:"Noruega",           away:"Senegal",            group:"F", stage:"grupo" },
  { id:"m044", date:"2026-06-22", time:"21:00", home:"Jordania",          away:"Argelia",            group:"H", stage:"grupo" },
  // ── 23 de junio ──
  { id:"m045", date:"2026-06-23", time:"11:00", home:"Portugal",          away:"Uzbekist\u00e1n",    group:"I", stage:"grupo" },
  { id:"m046", date:"2026-06-23", time:"14:00", home:"Inglaterra",        away:"Ghana",              group:"J", stage:"grupo" },
  { id:"m047", date:"2026-06-23", time:"17:00", home:"Panam\u00e1",       away:"Croacia",            group:"K", stage:"grupo" },
  { id:"m048", date:"2026-06-23", time:"20:00", home:"Colombia",          away:"RD Congo",           group:"L", stage:"grupo" },
  // ── 24 de junio ──
  { id:"m049", date:"2026-06-24", time:"13:00", home:"Suiza",             away:"Canad\u00e1",        group:"E", stage:"grupo" },
  { id:"m050", date:"2026-06-24", time:"13:00", home:"Bosnia",            away:"Catar",              group:"C", stage:"grupo" },
  { id:"m051", date:"2026-06-24", time:"16:00", home:"Escocia",           away:"Brasil",             group:"G", stage:"grupo" },
  { id:"m052", date:"2026-06-24", time:"16:00", home:"Marruecos",         away:"Hait\u00ed",         group:"F", stage:"grupo" },
  { id:"m053", date:"2026-06-24", time:"19:00", home:"Chequia",           away:"M\u00e9xico",        group:"A", stage:"grupo" },
  { id:"m054", date:"2026-06-24", time:"19:00", home:"Sud\u00e1frica",    away:"Corea del Sur",      group:"B", stage:"grupo" },
  // ── 25 de junio ──
  { id:"m055", date:"2026-06-25", time:"14:00", home:"Curazao",           away:"Costa de Marfil",    group:"K", stage:"grupo" },
  { id:"m056", date:"2026-06-25", time:"14:00", home:"Ecuador",           away:"Alemania",           group:"I", stage:"grupo" },
  { id:"m057", date:"2026-06-25", time:"17:00", home:"Jap\u00f3n",        away:"Suecia",             group:"J", stage:"grupo" },
  { id:"m058", date:"2026-06-25", time:"17:00", home:"T\u00fanez",        away:"Pa\u00edses Bajos",  group:"L", stage:"grupo" },
  { id:"m059", date:"2026-06-25", time:"20:00", home:"Turqu\u00eda",      away:"Estados Unidos",     group:"D", stage:"grupo" },
  { id:"m060", date:"2026-06-25", time:"20:00", home:"Paraguay",          away:"Australia",          group:"H", stage:"grupo" },
  // ── 26 de junio ──
  { id:"m061", date:"2026-06-26", time:"13:00", home:"Noruega",           away:"Francia",            group:"E", stage:"grupo" },
  { id:"m062", date:"2026-06-26", time:"13:00", home:"Senegal",           away:"Irak",               group:"F", stage:"grupo" },
  { id:"m063", date:"2026-06-26", time:"18:00", home:"Cabo Verde",        away:"Arabia Saudita",     group:"A", stage:"grupo" },
  { id:"m064", date:"2026-06-26", time:"18:00", home:"Uruguay",           away:"Espa\u00f1a",        group:"C", stage:"grupo" },
  { id:"m065", date:"2026-06-26", time:"21:00", home:"Egipto",            away:"Ir\u00e1n",          group:"B", stage:"grupo" },
  { id:"m066", date:"2026-06-26", time:"21:00", home:"Nueva Zelanda",     away:"B\u00e9lgica",       group:"D", stage:"grupo" },
  // ── 27 de junio ──
  { id:"m067", date:"2026-06-27", time:"15:00", home:"Panam\u00e1",       away:"Inglaterra",         group:"J", stage:"grupo" },
  { id:"m068", date:"2026-06-27", time:"15:00", home:"Croacia",           away:"Ghana",              group:"K", stage:"grupo" },
  { id:"m069", date:"2026-06-27", time:"17:30", home:"Colombia",          away:"Portugal",           group:"I", stage:"grupo" },
  { id:"m070", date:"2026-06-27", time:"17:30", home:"RD Congo",          away:"Uzbekist\u00e1n",    group:"L", stage:"grupo" },
  { id:"m071", date:"2026-06-27", time:"20:00", home:"Argelia",           away:"Austria",            group:"H", stage:"grupo" },
  { id:"m072", date:"2026-06-27", time:"20:00", home:"Jordania",          away:"Argentina",          group:"G", stage:"grupo" },
];

// Emoji banderas por pa\u00eds
const FLAG_EMOJI = {
  "M\u00e9xico":"\uD83C\uDDF2\uD83C\uDDFD","Sud\u00e1frica":"\uD83C\uDDFF\uD83C\uDDE6","Corea del Sur":"\uD83C\uDDF0\uD83C\uDDF7",
  "Chequia":"\uD83C\uDDE8\uD83C\uDDFF","Canad\u00e1":"\uD83C\uDDE8\uD83C\uDDE6","Bosnia":"\uD83C\uDDE7\uD83C\uDDE6",
  "Estados Unidos":"\uD83C\uDDFA\uD83C\uDDF8","Paraguay":"\uD83C\uDDF5\uD83C\uDDFE","Catar":"\uD83C\uDDF6\uD83C\uDDE6",
  "Suiza":"\uD83C\uDDE8\uD83C\uDDED","Brasil":"\uD83C\uDDE7\uD83C\uDDF7","Marruecos":"\uD83C\uDDF2\uD83C\uDDE6",
  "Hait\u00ed":"\uD83C\uDDED\uD83C\uDDF9","Escocia":"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F","Australia":"\uD83C\uDDE6\uD83C\uDDFA",
  "Turqu\u00eda":"\uD83C\uDDF9\uD83C\uDDF7","Alemania":"\uD83C\uDDE9\uD83C\uDDEA","Curazao":"\uD83C\uDDE8\uD83C\uDDFC",
  "Pa\u00edses Bajos":"\uD83C\uDDF3\uD83C\uDDF1","Jap\u00f3n":"\uD83C\uDDEF\uD83C\uDDF5","Costa de Marfil":"\uD83C\uDDE8\uD83C\uDDEE",
  "Ecuador":"\uD83C\uDDEA\uD83C\uDDE8","Suecia":"\uD83C\uDDF8\uD83C\uDDEA","T\u00fanez":"\uD83C\uDDF9\uD83C\uDDF3",
  "Espa\u00f1a":"\uD83C\uDDEA\uD83C\uDDF8","Cabo Verde":"\uD83C\uDDE8\uD83C\uDDFB","B\u00e9lgica":"\uD83C\uDDE7\uD83C\uDDEA",
  "Egipto":"\uD83C\uDDEA\uD83C\uDDEC","Arabia Saudita":"\uD83C\uDDF8\uD83C\uDDE6","Uruguay":"\uD83C\uDDFA\uD83C\uDDFE",
  "Ir\u00e1n":"\uD83C\uDDEE\uD83C\uDDF7","Nueva Zelanda":"\uD83C\uDDF3\uD83C\uDDFF","Francia":"\uD83C\uDDEB\uD83C\uDDF7",
  "Senegal":"\uD83C\uDDF8\uD83C\uDDF3","Irak":"\uD83C\uDDEE\uD83C\uDDF6","Noruega":"\uD83C\uDDF3\uD83C\uDDF4",
  "Argentina":"\uD83C\uDDE6\uD83C\uDDF7","Argelia":"\uD83C\uDDE9\uD83C\uDDFF","Austria":"\uD83C\uDDE6\uD83C\uDDF9",
  "Jordania":"\uD83C\uDDEF\uD83C\uDDF4","Portugal":"\uD83C\uDDF5\uD83C\uDDF9","RD Congo":"\uD83C\uDDE8\uD83C\uDDE9",
  "Inglaterra":"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F","Croacia":"\uD83C\uDDED\uD83C\uDDF7","Ghana":"\uD83C\uDDEC\uD83C\uDDED",
  "Panam\u00e1":"\uD83C\uDDF5\uD83C\uDDE6","Uzbekist\u00e1n":"\uD83C\uDDFA\uD83C\uDDFF","Colombia":"\uD83C\uDDE8\uD83C\uDDF4",
  "Escocia":"\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F"
};

function getFlag(country) {
  return FLAG_EMOJI[country] || "\uD83C\uDFF4";
}

// Colores de grupo para badge
const GROUP_COLORS = {
  A:"#e63946", B:"#457b9d", C:"#2d6a4f", D:"#e9c46a",
  E:"#f4a261", F:"#264653", G:"#a8dadc", H:"#6d6875",
  I:"#b5838d", J:"#3a86ff", K:"#06d6a0", L:"#ffbe0b"
};
