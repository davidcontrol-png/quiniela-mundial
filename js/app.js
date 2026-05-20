// ============================================================
//  QUINIELA MUNDIAL 2026 - Ogilvy El Salvador
//  app.js
// ============================================================

const WC_API_KEY  = "TU_WC2026_API_KEY";
const WC_API_BASE = "https://api.wc2026api.com";

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
  if (!usernameRaw || !password) { errEl.textContent = "Ingresa usuario y contrase\u00f1a."; return; }
  const username = usernameRaw.toLowerCase();
  try {
    const snap = await db.collection("users").where("username", "==", username).limit(1).get();
    if (snap.empty) { errEl.textContent = "Usuario no encontrado."; return; }
    const userData = snap.docs[0].data();
    if (userData.disabled) { errEl.textContent = "Tu cuenta est\u00e1 desactivada."; return; }
    await auth.signInWithEmailAndPassword(userData.email, password);
  } catch(e) {
    console.error("Login error:", e.code, e.message);
    if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
      errEl.textContent = "Contrase\u00f1a incorrecta.";
    } else if (e.code === "auth/too-many-requests") {
      errEl.textContent = "Demasiados intentos. Espera unos minutos.";
    } else {
      errEl.textContent = "Error al ingresar. Intenta de nuevo.";
    }
  }
}

document.getElementById("btn-logout").addEventListener("click", () => auth.signOut());

// ============================================================
//  MODAL CAMBIAR CONTRASE\u00d1A
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

document.getElementById("btn-save-pass").addEventListener("click", async () => {
  const current  = document.getElementById("pass-current").value;
  const newPass  = document.getElementById("pass-new").value;
  const confirm  = document.getElementById("pass-confirm").value;
  const errEl    = document.getElementById("pass-error");
  errEl.textContent = "";

  if (!current || !newPass || !confirm) {
    errEl.textContent = "Completa todos los campos."; return;
  }
  if (newPass.length < 6) {
    errEl.textContent = "La nueva contrase\u00f1a debe tener al menos 6 caracteres."; return;
  }
  if (newPass !== confirm) {
    errEl.textContent = "Las contrase\u00f1as no coinciden."; return;
  }

  try {
    // Re-autenticar con la contrase\u00f1a actual
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, current);
    await currentUser.reauthenticateWithCredential(credential);

    // Cambiar la contrase\u00f1a
    await currentUser.updatePassword(newPass);

    document.getElementById("modal-pass").classList.add("hidden");
    showToast("\u2705 Contrase\u00f1a actualizada correctamente.", "success");
  } catch(e) {
    console.error("Change pass error:", e.code);
    if (e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
      errEl.textContent = "La contrase\u00f1a actual es incorrecta.";
    } else if (e.code === "auth/weak-password") {
      errEl.textContent = "La nueva contrase\u00f1a es muy d\u00e9bil.";
    } else {
      errEl.textContent = "Error al cambiar. Intenta de nuevo.";
    }
  }
});

// Cerrar modal al hacer clic fuera
document.getElementById("modal-pass").addEventListener("click", e => {
  if (e.target === document.getElementById("modal-pass")) {
    document.getElementById("modal-pass").classList.add("hidden");
  }
});

// ============================================================
//  CARGAR APP
// ============================================================
async function loadApp() {
  await Promise.all([loadMatches(), loadUserPredictions(), loadLeaderboard()]);
  renderView("home");
}

async function loadMatches() {
  const snap = await db.collection("matches").orderBy("datetime").get();
  allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (allMatches.length === 0) {
    await seedMatches();
    const snap2 = await db.collection("matches").orderBy("datetime").get();
    allMatches = snap2.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  if (WC_API_KEY !== "TU_WC2026_API_KEY") syncScoresFromAPI();
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

async function syncScoresFromAPI() {
  try {
    const res  = await fetch(`${WC_API_BASE}/matches`, { headers: { Authorization: `Bearer ${WC_API_KEY}` } });
    const data = await res.json();
    const batch = db.batch();
    let changed = 0;
    data.forEach(apiMatch => {
      const local = allMatches.find(m =>
        m.home.toLowerCase() === (apiMatch.home_team || "").toLowerCase() &&
        m.away.toLowerCase() === (apiMatch.away_team || "").toLowerCase()
      );
      if (!local) return;
      if (apiMatch.status === "finished" && local.status !== "finished") {
        batch.update(db.collection("matches").doc(local.id), {
          scoreHome: apiMatch.home_score ?? null, scoreAway: apiMatch.away_score ?? null,
          status: "finished", apiMatchId: apiMatch.id
        });
        changed++;
      }
    });
    if (changed > 0) {
      await batch.commit();
      await recalculateAllPoints();
      await loadMatches(); await loadLeaderboard();
      if (currentView === "home" || currentView === "leaderboard") renderView(currentView);
    }
  } catch(e) { console.warn("No se pudo sincronizar con API:", e); }
}

async function loadUserPredictions() {
  const snap = await db.collection("predictions").where("userId", "==", currentUser.uid).get();
  predictions = {};
  snap.docs.forEach(d => {
    const p = d.data();
    predictions[p.matchId] = { home: p.predictedHome, away: p.predictedAway, docId: d.id };
  });
}

async function loadLeaderboard() {
  const snap = await db.collection("users").where("disabled", "==", false).get();
  leaderboard = snap.docs.map(d => {
    const u = d.data();
    return { uid: d.id, name: u.displayName || u.username, points: u.totalPoints || 0, exact: u.exactPredictions || 0, result: u.resultPredictions || 0 };
  }).sort((a, b) => b.points - a.points || b.exact - a.exact);
}

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
      const pts = calculatePoints({ home: pred.predictedHome, away: pred.predictedAway }, { home: match.scoreHome, away: match.scoreAway });
      total += pts;
      if (pts === 3) exact++;
      if (pts === 1) result++;
      db.collection("predictions").doc(pd.id).update({ points: pts });
    }
    await db.collection("users").doc(uid).update({ totalPoints: total, exactPredictions: exact, resultPredictions: result });
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
  document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("active", b.getAttribute("data-view") === view));
  if (view === "home")        renderHome();
  if (view === "predictions") renderPredictions();
  if (view === "leaderboard") renderLeaderboard();
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
    container.innerHTML = `<p class="empty-state">\u26BD No hay partidos programados por ahora.</p>`;
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
        ? `<button class="btn-save-pred" data-match="${m.id}">\u2713 Guardar</button>`
        : `<span class="lock-label">\uD83D\uDD12 Cerrado</span>`}
    </div>` : "";
  const pts = (pred && m.status === "finished")
    ? `<span class="points-badge pts-${calculatePoints(pred, { home: m.scoreHome, away: m.scoreAway })}">${calculatePoints(pred, { home: m.scoreHome, away: m.scoreAway })} pts</span>`
    : "";
  return `
  <div class="match-card ${m.status}">
    <div class="match-group-badge" style="background:${GROUP_COLORS[m.group] || '#444'}">Grupo ${m.group}</div>
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
      if (isNaN(home) || isNaN(away) || home < 0 || away < 0) { showToast("Ingresa un marcador v\u00e1lido.", "error"); return; }
      const match = allMatches.find(m => m.id === matchId);
      if (isMatchLocked(match)) { showToast("Este partido ya est\u00e1 cerrado.", "error"); return; }
      await savePrediction(matchId, home, away);
      btn.textContent = "\u2713 Guardado!";
      btn.style.background = "#06d6a0";
      setTimeout(() => { btn.textContent = "\u2713 Guardar"; btn.style.background = ""; }, 2000);
    });
  });
}

async function savePrediction(matchId, home, away) {
  const existing = predictions[matchId];
  const data = { userId: currentUser.uid, matchId, predictedHome: home, predictedAway: away, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), points: 0 };
  if (existing?.docId) {
    await db.collection("predictions").doc(existing.docId).update(data);
  } else {
    const ref = await db.collection("predictions").add(data);
    predictions[matchId] = { home, away, docId: ref.id };
  }
  predictions[matchId] = { ...predictions[matchId], home, away };
  showToast("Predicci\u00f3n guardada \u2705", "success");
}

// ============================================================
//  PREDICCIONES
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
    const label = d.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" }).replace(/^\w/, c => c.toUpperCase());
    html += `<h3 class="date-header">\uD83D\uDCC5 ${label}</h3>`;
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
    const medal = i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : `${i + 1}`;
    const isMe  = u.uid === currentUser.uid;
    return `<tr class="${isMe ? "my-row" : ""}">
      <td class="rank-cell">${medal}</td>
      <td class="name-cell">${u.name}${isMe ? " <span class='you-badge'>T\u00fa</span>" : ""}</td>
      <td class="pts-cell">${u.points}</td>
      <td class="detail-cell">\uD83C\uDFAF ${u.exact}</td>
      <td class="detail-cell">\u2714\uFE0F ${u.result}</td>
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
  setTimeout(() => toast.classList.remove("show"), 3000);
}

setInterval(() => {
  const now = new Date();
  const hasLive = allMatches.some(m => {
    const ko  = m.datetime?.toDate ? m.datetime.toDate() : new Date();
    const end = new Date(ko.getTime() + 105 * 60 * 1000);
    return now >= ko && now <= end;
  });
  if (hasLive && WC_API_KEY !== "TU_WC2026_API_KEY") syncScoresFromAPI();
}, 10 * 60 * 1000);
