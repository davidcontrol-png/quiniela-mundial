// ============================================================
//  QUINIELA OGILVY 2026 - Ogilvy El Salvador
//  app.js - con integración openfootball (sin API key)
// ============================================================

// URL pública sin API key — datos actualizados por la comunidad
const OPENFOOTBALL_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

// Mapeo de nombres en inglés (openfootball) a español (nuestra app)
const NAME_MAP = {
  "Mexico": "México", "South Africa": "Sudáfrica", "South Korea": "Corea del Sur",
  "Czech Republic": "Chequia", "Canada": "Canadá", "Bosnia & Herzegovina": "Bosnia",
  "Qatar": "Catar", "Switzerland": "Suiza", "Brazil": "Brasil", "Morocco": "Marruecos",
  "Haiti": "Haití", "Scotland": "Escocia", "USA": "Estados Unidos", "Paraguay": "Paraguay",
  "Australia": "Australia", "Turkey": "Turquía", "Germany": "Alemania", "Curaçao": "Curazao",
  "Ivory Coast": "Costa de Marfil", "Ecuador": "Ecuador", "Netherlands": "Países Bajos",
  "Japan": "Japón", "Sweden": "Suecia", "Tunisia": "Túnez", "Belgium": "Bélgica",
  "Egypt": "Egipto", "Iran": "Irán", "New Zealand": "Nueva Zelanda", "Spain": "España",
  "Cape Verde": "Cabo Verde", "Saudi Arabia": "Arabia Saudita", "Uruguay": "Uruguay",
  "France": "Francia", "Senegal": "Senegal", "Iraq": "Irak", "Norway": "Noruega",
  "Argentina": "Argentina", "Algeria": "Argelia", "Austria": "Austria", "Jordan": "Jordania",
  "Portugal": "Portugal", "DR Congo": "RD Congo", "Uzbekistan": "Uzbekistán", "Colombia": "Colombia",
  "England": "Inglaterra", "Croatia": "Croacia", "Ghana": "Ghana", "Panama": "Panamá",
  "Korea Republic": "Corea del Sur", "Czechia": "Chequia", "Côte d'Ivoire": "Costa de Marfil",
  "Bosnia and Herzegovina": "Bosnia"
};

function toSpanish(name) {
  return NAME_MAP[name] || name;
}

let currentUser  = null;
let currentView  = "home";
let allMatches   = [];
let predictions  = {};
let leaderboard  = [];

// ============================================================
//  AUTH STATE
// ============================================================
auth.onAuthStateChanged(async user => {
  if (user) {
    currentUser = user;
    try {
      const snap = await db.collection("users").doc(user.uid).get();
      if (!snap.exists) { auth.signOut(); return; }
      const data = snap.data();
      if (data.disabled) { auth.signOut(); return; }
      document.getElementById("screen-login").classList.add("hidden");
      document.getElementById("screen-app").classList.remove("hidden");
      document.getElementById("user-display-name").textContent = data.displayName || data.username;
      document.getElementById("user-avatar").textContent = (data.displayName || data.username || "?").charAt(0).toUpperCase();
      loadApp();
    } catch(e) { console.error("Error cargando usuario:", e); }
  } else {
    currentUser = null;
    document.getElementById("screen-login").classList.remove("hidden");
    document.getElementById("screen-app").classList.add("hidden");
  }
});

// ============================================================
//  LOGIN
// ============================================================
document.getElementById("btn-login").addEventListener("click", handleLogin);
document.getElementById("input-password").addEventListener("keydown", e => {
  if (e.key === "Enter") handleLogin();
});

async function handleLogin() {
  const usernameRaw = document.getElementById("input-username").value.trim();
  const password    = document.getElementById("input-password").value;
  const errEl       = document.getElementById("login-error");
  errEl.textContent = "";
  if (!usernameRaw || !password) { errEl.textContent = "Ingresa usuario y contraseña."; return; }
  const username = usernameRaw.toLowerCase();
  try {
    const snap = await db.collection("users").where("username", "==", username).limit(1).get();
    if (snap.empty) { errEl.textContent = "Usuario no encontrado."; return; }
    const userData = snap.docs[0].data();
    if (userData.disabled) { errEl.textContent = "Tu cuenta está desactivada."; return; }
    await auth.signInWithEmailAndPassword(userData.email, password);
  } catch(e) {
    console.error("Login error:", e.code, e.message);
    if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
      errEl.textContent = "Contraseña incorrecta.";
    } else if (e.code === "auth/too-many-requests") {
      errEl.textContent = "Demasiados intentos. Espera unos minutos.";
    } else {
      errEl.textContent = "Error al ingresar. Intenta de nuevo.";
    }
  }
}

document.getElementById("btn-logout").addEventListener("click", () => auth.signOut());

// ============================================================
//  MODAL CAMBIAR CONTRASEÑA
// ============================================================
document.getElementById("btn-change-pass").addEventListener("click", () => {
  document.getElementById("modal-pass").classList.remove("hidden");
  document.getElementById("pass-current").value = "";
  document.getElementById("pass-new").value = "";
  document.getElementById("pass-confirm").value = "";
  document.getElementById("pass-error").textContent = "";
});

document.getElementById("btn-cancel-pass").addEventListener("click", () => {
  document.getElementById("modal-pass").classList.add("hidden");
});

document.getElementById("modal-pass").addEventListener("click", e => {
  if (e.target === document.getElementById("modal-pass"))
    document.getElementById("modal-pass").classList.add("hidden");
});

document.getElementById("btn-save-pass").addEventListener("click", async () => {
  const current = document.getElementById("pass-current").value;
  const newPass = document.getElementById("pass-new").value;
  const confirm = document.getElementById("pass-confirm").value;
  const errEl   = document.getElementById("pass-error");
  errEl.textContent = "";
  if (!current || !newPass || !confirm) { errEl.textContent = "Completa todos los campos."; return; }
  if (newPass.length < 6) { errEl.textContent = "Mínimo 6 caracteres."; return; }
  if (newPass !== confirm) { errEl.textContent = "Las contraseñas no coinciden."; return; }
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, current);
    await currentUser.reauthenticateWithCredential(credential);
    await currentUser.updatePassword(newPass);
    document.getElementById("modal-pass").classList.add("hidden");
    showToast("✅ Contraseña actualizada correctamente.", "success");
  } catch(e) {
    if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential")
      errEl.textContent = "La contraseña actual es incorrecta.";
    else
      errEl.textContent = "Error al cambiar. Intenta de nuevo.";
  }
});

// ============================================================
//  CARGAR APP
// ============================================================
async function loadApp() {
  await Promise.all([loadMatches(), loadUserPredictions(), loadLeaderboard()]);
  renderView("home");
  // Sincronizar resultados al cargar
  syncScoresFromOpenFootball();
}

// ============================================================
//  PARTIDOS — Firestore + seed inicial
// ============================================================
async function loadMatches() {
  const snap = await db.collection("matches").orderBy("datetime").get();
  allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (allMatches.length === 0) {
    await seedMatches();
    const snap2 = await db.collection("matches").orderBy("datetime").get();
    allMatches = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

async function seedMatches() {
  const batch = db.batch();
  MATCHES_GROUP_STAGE.forEach(m => {
    const ref = db.collection("matches").doc(m.id);
    const dt  = new Date(`${m.date}T${m.time}:00-06:00`);
    batch.set(ref, {
      home: m.home, away: m.away, group: m.group, stage: m.stage,
      datetime: firebase.firestore.Timestamp.fromDate(dt),
      dateStr: m.date, timeStr: m.time,
      scoreHome: null, scoreAway: null, status: "scheduled", apiMatchId: null
    });
  });
  await batch.commit();
}

// ============================================================
//  SYNC CON OPENFOOTBALL — sin API key
// ============================================================
async function syncScoresFromOpenFootball() {
  try {
    const res  = await fetch(OPENFOOTBALL_URL + "?t=" + Date.now()); // evitar caché
    const data = await res.json();
    if (!data.matches) return;

    const batch = db.batch();
    let changed = 0;

    for (const apiMatch of data.matches) {
      // Solo procesar partidos que ya tienen score
      if (apiMatch.score === undefined || apiMatch.score === null) continue;
      const s = apiMatch.score;
      if (s.ft === undefined) continue; // ft = full time

      const homeEn = apiMatch.team1;
      const awayEn = apiMatch.team2;
      const homeEs = toSpanish(homeEn);
      const awayEs = toSpanish(awayEn);
      const scoreHome = s.ft[0];
      const scoreAway = s.ft[1];

      // Buscar partido local por nombre en español
      const local = allMatches.find(m =>
        m.home.toLowerCase() === homeEs.toLowerCase() &&
        m.away.toLowerCase() === awayEs.toLowerCase()
      );

      if (!local) continue;
      if (local.status === "finished" &&
          local.scoreHome === scoreHome &&
          local.scoreAway === scoreAway) continue; // ya está actualizado

      const ref = db.collection("matches").doc(local.id);
      batch.update(ref, {
        scoreHome, scoreAway, status: "finished"
      });

      // Actualizar local también para calcular puntos
      local.scoreHome = scoreHome;
      local.scoreAway = scoreAway;
      local.status = "finished";
      changed++;
    }

    if (changed > 0) {
      await batch.commit();
      console.log(`✅ ${changed} partidos actualizados desde openfootball`);
      await recalculateAllPoints();
      await loadMatches();
      await loadLeaderboard();
      if (currentView === "home" || currentView === "leaderboard") renderView(currentView);
      showToast(`✅ ${changed} resultado(s) actualizado(s)`, "success");
    }
  } catch(e) {
    console.warn("No se pudo sincronizar con openfootball:", e);
  }
}

// ============================================================
//  PREDICCIONES
// ============================================================
async function loadUserPredictions() {
  const snap = await db.collection("predictions").where("userId", "==", currentUser.uid).get();
  predictions = {};
  snap.docs.forEach(d => {
    const p = d.data();
    predictions[p.matchId] = { home: p.predictedHome, away: p.predictedAway, docId: d.id };
  });
}

async function savePrediction(matchId, home, away) {
  const existing = predictions[matchId];
  const data = {
    userId: currentUser.uid, matchId,
    predictedHome: home, predictedAway: away,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(), points: 0
  };
  if (existing?.docId) {
    await db.collection("predictions").doc(existing.docId).update(data);
  } else {
    const ref = await db.collection("predictions").add(data);
    predictions[matchId] = { home, away, docId: ref.id };
  }
  predictions[matchId] = { ...predictions[matchId], home, away };
  showToast("Predicción guardada ✅", "success");
}

// ============================================================
//  LEADERBOARD
// ============================================================
async function loadLeaderboard() {
  const snap = await db.collection("users").where("disabled", "==", false).get();
  leaderboard = snap.docs.map(d => {
    const u = d.data();
    return { uid: d.id, name: u.displayName || u.username, points: u.totalPoints || 0, exact: u.exactPredictions || 0, result: u.resultPredictions || 0 };
  }).sort((a, b) => b.points - a.points || b.exact - a.exact);
}

// ============================================================
//  RECALCULAR PUNTOS
// ============================================================
async function recalculateAllPoints() {
  const finished = allMatches.filter(m => m.status === "finished");
  const usersSnap = await db.collection("users").get();
  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const predsSnap = await db.collection("predictions").where("userId", "==", uid).get();
    let total = 0, exact = 0, result = 0;
    for (const pd of predsSnap.docs) {
      const pred  = pd.data();
      const match = finished.find(m => m.id === pred.matchId);
      if (!match) continue;
      const pts = calculatePoints(
        { home: pred.predictedHome, away: pred.predictedAway },
        { home: match.scoreHome, away: match.scoreAway }
      );
      total += pts;
      if (pts === 3) exact++;
      if (pts === 1) result++;
      db.collection("predictions").doc(pd.id).update({ points: pts });
    }
    await db.collection("users").doc(uid).update({
      totalPoints: total, exactPredictions: exact, resultPredictions: result
    });
  }
}

function calculatePoints(pred, actual) {
  if (actual.home === null || actual.away === null) return 0;
  if (pred.home === actual.home && pred.away === actual.away) return 3;
  if (Math.sign(pred.home - pred.away) === Math.sign(actual.home - actual.away)) return 1;
  return 0;
}

// ============================================================
//  NAVEGACION
// ============================================================
document.querySelectorAll("[data-view]").forEach(btn => {
  btn.addEventListener("click", () => renderView(btn.getAttribute("data-view")));
});

function renderView(view) {
  currentView = view;
  document.querySelectorAll(".view-section").forEach(s => s.classList.add("hidden"));
  document.getElementById(`view-${view}`).classList.remove("hidden");
  document.querySelectorAll("[data-view]").forEach(b =>
    b.classList.toggle("active", b.getAttribute("data-view") === view));
  if (view === "home")        renderHome();
  if (view === "predictions") renderPredictions();
  if (view === "leaderboard") renderLeaderboard();
  if (view === "weekly")       renderWeeklyPoints();
}

// ============================================================
//  HOME
// ============================================================
function renderHome() {
  const container = document.getElementById("matches-today");
  const todayStr  = new Date().toLocaleDateString("en-CA", { timeZone: "America/El_Salvador" });
  let todayMatches = allMatches.filter(m => m.dateStr === todayStr);
  if (todayMatches.length === 0) {
    const upcoming = allMatches.filter(m => m.dateStr >= todayStr && m.status !== "finished");
    if (upcoming.length > 0) {
      const nextDate = upcoming[0].dateStr;
      todayMatches = upcoming.filter(m => m.dateStr === nextDate);
    }
  }
  if (todayMatches.length === 0) {
    container.innerHTML = `<p class="empty-state">⚽ No hay partidos programados por ahora.</p>`;
    return;
  }
  container.innerHTML = todayMatches.map(m => renderMatchCard(m, true)).join("");
  addPredictionListeners(container);
}

function renderMatchCard(m, showPrediction = false) {
  const pred   = predictions[m.id];
  const locked = isMatchLocked(m);
  const score  = m.status === "finished"
    ? `<span class="score-result">${m.scoreHome} - ${m.scoreAway}</span>`
    : `<span class="match-time">${m.timeStr}</span>`;
  const predHtml = showPrediction ? `
    <div class="prediction-row ${locked ? "locked" : ""}">
      <input type="number" min="0" max="20" class="score-input" data-match="${m.id}" data-side="home"
        value="${pred ? pred.home : ""}" ${locked ? "disabled" : ""} placeholder="0">
      <span class="dash">-</span>
      <input type="number" min="0" max="20" class="score-input" data-match="${m.id}" data-side="away"
        value="${pred ? pred.away : ""}" ${locked ? "disabled" : ""} placeholder="0">
      ${!locked
        ? `<button class="btn-save-pred" data-match="${m.id}">✓ Guardar</button>`
        : `<span class="lock-label">🔒 Cerrado</span>`}
    </div>` : "";
  const pts = (pred && m.status === "finished")
    ? `<span class="points-badge pts-${calculatePoints(pred, { home: m.scoreHome, away: m.scoreAway })}">${calculatePoints(pred, { home: m.scoreHome, away: m.scoreAway })} pts</span>`
    : "";
  return `
  <div class="match-card ${m.status}">
    <div class="match-group-badge" style="background:${GROUP_COLORS[m.group] || '#333'}">Grupo ${m.group}</div>
    <div class="match-teams">
      <div class="team home"><span class="flag">${getFlag(m.home)}</span><span class="team-name">${m.home}</span></div>
      <div class="match-center">${score}<span class="vs-label">VS</span></div>
      <div class="team away"><span class="team-name">${m.away}</span><span class="flag">${getFlag(m.away)}</span></div>
    </div>
    ${pts}${predHtml}
  </div>`;
}

function isMatchLocked(m) {
  const kickoff = m.datetime?.toDate ? m.datetime.toDate() : new Date(m.datetime);
  return new Date() >= new Date(kickoff.getTime() - 60 * 60 * 1000) || m.status === "finished";
}

function addPredictionListeners(container) {
  container.querySelectorAll(".btn-save-pred").forEach(btn => {
    btn.addEventListener("click", async () => {
      const matchId   = btn.getAttribute("data-match");
      const homeInput = container.querySelector(`.score-input[data-match="${matchId}"][data-side="home"]`);
      const awayInput = container.querySelector(`.score-input[data-match="${matchId}"][data-side="away"]`);
      const home = parseInt(homeInput.value);
      const away = parseInt(awayInput.value);
      if (isNaN(home) || isNaN(away) || home < 0 || away < 0) { showToast("Ingresa un marcador válido.", "error"); return; }
      const match = allMatches.find(m => m.id === matchId);
      if (isMatchLocked(match)) { showToast("Este partido ya está cerrado.", "error"); return; }
      await savePrediction(matchId, home, away);
      btn.textContent = "✓ Guardado!";
      btn.style.background = "#2d7a2d";
      setTimeout(() => { btn.textContent = "✓ Guardar"; btn.style.background = ""; }, 2000);
    });
  });
}

// ============================================================
//  PREDICCIONES — vista completa
// ============================================================
function renderPredictions() {
  const container = document.getElementById("predictions-list");
  const search    = (document.getElementById("pred-search")?.value || "").toLowerCase();
  const byDate    = {};
  allMatches.forEach(m => {
    if (search && !m.home.toLowerCase().includes(search) && !m.away.toLowerCase().includes(search)) return;
    if (!byDate[m.dateStr]) byDate[m.dateStr] = [];
    byDate[m.dateStr].push(m);
  });
  let html = "";
  Object.keys(byDate).sort().forEach(date => {
    const d = new Date(date + "T12:00:00");
    const label = d.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" })
                   .replace(/^\w/, c => c.toUpperCase());
    html += `<h3 class="date-header">📅 ${label}</h3>`;
    html += byDate[date].map(m => renderMatchCard(m, true)).join("");
  });
  container.innerHTML = html || `<p class="empty-state">No se encontraron partidos.</p>`;
  addPredictionListeners(container);
}

document.getElementById("pred-search")?.addEventListener("input", renderPredictions);

// ============================================================
//  LEADERBOARD
// ============================================================
function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = leaderboard.map((u, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
    const isMe  = u.uid === currentUser.uid;
    return `<tr class="${isMe ? "my-row" : ""}">
      <td class="rank-cell">${medal}</td>
      <td class="name-cell">${u.name}${isMe ? " <span class='you-badge'>Tú</span>" : ""}</td>
      <td class="pts-cell">${u.points}</td>
      <td class="detail-cell">🎯 ${u.exact}</td>
      <td class="detail-cell">✔️ ${u.result}</td>
    </tr>`;
  }).join("");
}

// ============================================================
//  TOAST
// ============================================================
function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// ============================================================
//  AUTO-SYNC cada 15 minutos
// ============================================================
setInterval(() => {
  syncScoresFromOpenFootball();
}, 15 * 60 * 1000);

// ============================================================
//  PUNTOS SEMANALES — vista de usuario
// ============================================================
async function renderWeeklyPoints() {
  const container = document.getElementById("weekly-list");
  if (!container) return;

  // Detectar semana actual
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/El_Salvador" });
  const weeks = [
    { label: "Semana 1", start: "2026-06-09", end: "2026-06-15" },
    { label: "Semana 2", start: "2026-06-16", end: "2026-06-22" },
    { label: "Semana 3", start: "2026-06-23", end: "2026-06-29" },
    { label: "Semana 4", start: "2026-06-30", end: "2026-07-06" },
    { label: "Semana 5", start: "2026-07-07", end: "2026-07-13" },
    { label: "Semana 6", start: "2026-07-14", end: "2026-07-19" },
  ];

  const currentWeek = weeks.find(w => today >= w.start && today <= w.end) || weeks[0];

  // Selector de semana
  const selHtml = `
    <div class="week-selector">
      <select id="weekly-week-select" onchange="changeWeek(this.value)">
        ${weeks.map(w => `<option value='${JSON.stringify(w)}' ${w.label === currentWeek.label ? "selected" : ""}>${w.label} (${w.start} al ${w.end})</option>`).join("")}
      </select>
    </div>`;
  container.innerHTML = selHtml + `<div id="weekly-table-container"><p class="empty-state">Calculando&hellip;</p></div>`;
  await renderWeekTable(currentWeek);
}

async function changeWeek(val) {
  const week = JSON.parse(val);
  await renderWeekTable(week);
}

async function renderWeekTable(week) {
  const tc = document.getElementById("weekly-table-container");
  if (!tc) return;
  tc.innerHTML = `<p class="empty-state">Calculando&hellip;</p>`;

  const matchesSnap = await db.collection("matches")
    .where("dateStr", ">=", week.start)
    .where("dateStr", "<=", week.end)
    .where("status", "==", "finished")
    .get();

  if (matchesSnap.empty) {
    tc.innerHTML = `<p class="empty-state">No hay partidos finalizados en ${week.label}.</p>`;
    return;
  }

  const weekMatchIds = new Set(matchesSnap.docs.map(d => d.id));
  const matchMap     = {};
  matchesSnap.docs.forEach(d => { matchMap[d.id] = d.data(); });

  const predsSnap = await db.collection("predictions").get();
  const usersSnap = await db.collection("users").where("disabled", "==", false).get();

  const weekPoints = {};
  predsSnap.docs.forEach(pd => {
    const p = pd.data();
    if (!weekMatchIds.has(p.matchId)) return;
    const m = matchMap[p.matchId];
    if (!m) return;
    const pts = calculatePoints(
      { home: p.predictedHome, away: p.predictedAway },
      { home: m.scoreHome, away: m.scoreAway }
    );
    if (!weekPoints[p.userId]) weekPoints[p.userId] = { pts: 0, exact: 0, result: 0 };
    weekPoints[p.userId].pts += pts;
    if (pts === 3) weekPoints[p.userId].exact++;
    if (pts === 1) weekPoints[p.userId].result++;
  });

  const rows = usersSnap.docs.map(d => {
    const u = d.data();
    const w = weekPoints[d.id] || { pts: 0, exact: 0, result: 0 };
    return { uid: d.id, name: u.displayName || u.username, ...w };
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);

  tc.innerHTML = `
    <p style="font-size:.75rem;color:var(--grey);margin-bottom:.75rem;letter-spacing:1px">
      ${matchesSnap.size} partido(s) jugado(s) &bull; ${week.label}
    </p>
    <div style="overflow-x:auto;border:1px solid var(--black-line);border-radius:8px">
      <table class="leaderboard-table">
        <thead>
          <tr><th>#</th><th>Nombre</th><th>Pts</th><th>Exactos</th><th>Resultado</th></tr>
        </thead>
        <tbody>
          ${rows.map((u, i) => {
            const medal  = i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : `${i+1}`;
            const isMe   = u.uid === currentUser.uid;
            return `<tr class="${isMe ? "my-row" : ""}">
              <td class="rank-cell">${medal}</td>
              <td class="name-cell">${u.name}${isMe ? " <span class='you-badge'>T\u00fa</span>" : ""}</td>
              <td class="pts-cell">${u.pts}</td>
              <td class="detail-cell">\uD83C\uDFAF ${u.exact}</td>
              <td class="detail-cell">\u2714\uFE0F ${u.result}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}
