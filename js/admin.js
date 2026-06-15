// ============================================================
//  QUINIELA OGILVY 2026 - Panel Admin v2
//  admin.js
// ============================================================

auth.onAuthStateChanged(async user => {
  if (!user) { window.location.href = "../index.html"; return; }
  const snap = await db.collection("users").doc(user.uid).get();
  if (!snap.exists || !snap.data().isAdmin) { window.location.href = "../index.html"; return; }
  document.getElementById("admin-name").textContent = snap.data().displayName || snap.data().username;
  initAdmin();
});

// ============================================================
//  TABS
// ============================================================
document.querySelectorAll(".admin-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(`panel-${tab.dataset.tab}`).classList.remove("hidden");
    if (tab.dataset.tab === "actividad")    loadActividad();
    if (tab.dataset.tab === "stats")        loadStats();
    if (tab.dataset.tab === "predicciones") loadPredicciones();
    if (tab.dataset.tab === "semanal")      loadSemanal();
  });
});

async function initAdmin() {
  await Promise.all([loadAdminUsers(), loadAdminMatches()]);
}

// ============================================================
//  PANEL: USUARIOS
// ============================================================
async function loadAdminUsers() {
  const snap  = await db.collection("users").orderBy("displayName").get();
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = snap.docs.map(doc => {
    const u = doc.data();
    return `
    <tr>
      <td>${u.displayName || "-"}</td>
      <td><code>${u.username}</code></td>
      <td>${u.email}</td>
      <td><span class="badge ${u.isAdmin ? "badge-admin" : "badge-user"}">${u.isAdmin ? "Admin" : "Usuario"}</span></td>
      <td><span class="badge ${u.disabled ? "badge-off" : "badge-on"}">${u.disabled ? "Inactivo" : "Activo"}</span></td>
      <td>${u.totalPoints || 0} pts</td>
      <td class="actions-cell">
        <button class="btn-sm btn-edit" onclick="editUser('${doc.id}','${u.displayName}','${u.username}','${u.email}',${u.isAdmin},${u.disabled})">Editar</button>
        <button class="btn-sm btn-reset" onclick="resetPasswordDirect('${doc.id}','${u.email}')">Reset Pass</button>
      </td>
    </tr>`;
  }).join("");
}

// ── Nuevo usuario ─────────────────────────────────────────────
document.getElementById("btn-new-user").addEventListener("click", () => {
  document.getElementById("user-modal").classList.remove("hidden");
  document.getElementById("modal-title").textContent = "Nuevo Usuario";
  document.getElementById("user-form").reset();
  document.getElementById("user-uid").value = "";
});

document.getElementById("btn-cancel-user").addEventListener("click", () => {
  document.getElementById("user-modal").classList.add("hidden");
});

document.getElementById("user-form").addEventListener("submit", async e => {
  e.preventDefault();
  const uid         = document.getElementById("user-uid").value;
  const displayName = document.getElementById("user-display-name").value.trim();
  const username    = document.getElementById("user-username").value.trim().toLowerCase();
  const email       = document.getElementById("user-email").value.trim();
  const password    = document.getElementById("user-password").value;
  const isAdmin     = document.getElementById("user-is-admin").checked;
  const disabled    = document.getElementById("user-disabled").checked;

  try {
    if (!uid) {
      const adminEmail    = auth.currentUser.email;
      const adminPassword = prompt("Ingresa tu contrase\u00f1a de admin para confirmar:");
      await auth.signInWithEmailAndPassword(adminEmail, adminPassword);
      const newUser = await auth.createUserWithEmailAndPassword(email, password || "Mundial2026!");
      await db.collection("users").doc(newUser.user.uid).set({
        displayName, username, email, isAdmin, disabled,
        totalPoints: 0, exactPredictions: 0, resultPredictions: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await auth.signInWithEmailAndPassword(adminEmail, adminPassword);
      showAdminToast("Usuario creado correctamente.", "success");
    } else {
      await db.collection("users").doc(uid).update({ displayName, username, isAdmin, disabled });
      showAdminToast("Usuario actualizado.", "success");
    }
    document.getElementById("user-modal").classList.add("hidden");
    await loadAdminUsers();
  } catch(err) {
    showAdminToast("Error: " + err.message, "error");
  }
});

function editUser(uid, displayName, username, email, isAdmin, disabled) {
  document.getElementById("user-modal").classList.remove("hidden");
  document.getElementById("modal-title").textContent = "Editar Usuario";
  document.getElementById("user-uid").value = uid;
  document.getElementById("user-display-name").value = displayName;
  document.getElementById("user-username").value = username;
  document.getElementById("user-email").value = email;
  document.getElementById("user-is-admin").checked = isAdmin;
  document.getElementById("user-disabled").checked = disabled;
  document.getElementById("user-password").value = "";
  document.getElementById("user-password").placeholder = "(dejar vac\u00edo para no cambiar)";
}

// ── Reset directo a Mundial2026! ──────────────────────────────
async function resetPasswordDirect(uid, email) {
  if (!confirm(`\u00bfResetear contrase\u00f1a de ${email} a "Mundial2026!"?`)) return;
  try {
    // Re-autenticar como admin y usar updatePassword via API REST
    const adminPassword = prompt("Ingresa tu contrase\u00f1a de admin:");
    const adminEmail    = auth.currentUser.email;
    await auth.signInWithEmailAndPassword(adminEmail, adminPassword);

    // Obtener token del admin
    const token = await auth.currentUser.getIdToken();

    // Usar Firebase Auth REST API para cambiar password del usuario
    const projectId = firebase.app().options.projectId;
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebase.app().options.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localId: uid,
          password: "Mundial2026!",
          idToken: token
        })
      }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    showAdminToast(`Contrase\u00f1a reseteada a Mundial2026!`, "success");
  } catch(e) {
    // Fallback: usar signInWithEmailAndPassword del usuario + updatePassword
    // Esto no es posible sin la clave de servicio en frontend
    // Mostramos instrucción alternativa
    showAdminToast("Usa Firebase Console \u2192 Authentication \u2192 edita el usuario para cambiar su contrase\u00f1a.", "info");
  }
}

// ============================================================
//  PANEL: PARTIDOS
// ============================================================
async function loadAdminMatches() {
  const snap  = await db.collection("matches").orderBy("datetime").get();
  const tbody = document.getElementById("matches-table-body");
  tbody.innerHTML = snap.docs.map(doc => {
    const m = doc.data();
    const dtStr = m.datetime?.toDate
      ? m.datetime.toDate().toLocaleString("es-SV", {timeZone:"America/El_Salvador",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})
      : "-";
    const scoreStr  = m.status === "finished" ? `${m.scoreHome}-${m.scoreAway}` : "-";
    const statusLabel = { scheduled:"\uD83D\uDD52 Programado", live:"\uD83D\uDFE2 En vivo", finished:"\u2705 Finalizado" };
    return `
    <tr>
      <td>${dtStr}</td>
      <td>${m.home} vs ${m.away}</td>
      <td>Grupo ${m.group} / ${m.stage}</td>
      <td>${statusLabel[m.status] || m.status}</td>
      <td>${scoreStr}</td>
      <td class="actions-cell">
        <button class="btn-sm btn-edit" onclick="editMatch('${doc.id}')">Editar</button>
        ${m.status !== "finished" ? `<button class="btn-sm btn-score" onclick="enterScore('${doc.id}','${m.home}','${m.away}')">Resultado</button>` : ""}
      </td>
    </tr>`;
  }).join("");
}

document.getElementById("btn-new-match").addEventListener("click", () => {
  document.getElementById("match-modal").classList.remove("hidden");
  document.getElementById("match-form").reset();
  document.getElementById("match-uid").value = "";
});

document.getElementById("btn-cancel-match").addEventListener("click", () => {
  document.getElementById("match-modal").classList.add("hidden");
});

document.getElementById("match-form").addEventListener("submit", async e => {
  e.preventDefault();
  const uid   = document.getElementById("match-uid").value;
  const home  = document.getElementById("match-home").value.trim();
  const away  = document.getElementById("match-away").value.trim();
  const group = document.getElementById("match-group").value.trim().toUpperCase();
  const stage = document.getElementById("match-stage").value;
  const dtVal = document.getElementById("match-datetime").value;
  if (!home || !away || !dtVal) { showAdminToast("Completa todos los campos.", "error"); return; }
  const payload = {
    home, away, group, stage,
    datetime: firebase.firestore.Timestamp.fromDate(new Date(dtVal)),
    dateStr: dtVal.substring(0, 10), timeStr: dtVal.substring(11, 16),
    scoreHome: null, scoreAway: null, status: "scheduled"
  };
  try {
    if (!uid) {
      await db.collection("matches").add(payload);
      showAdminToast("Partido agregado.", "success");
    } else {
      await db.collection("matches").doc(uid).update(payload);
      showAdminToast("Partido actualizado.", "success");
    }
    document.getElementById("match-modal").classList.add("hidden");
    await loadAdminMatches();
  } catch(err) { showAdminToast("Error: " + err.message, "error"); }
});

async function editMatch(matchId) {
  const doc  = await db.collection("matches").doc(matchId).get();
  const m    = doc.data();
  const dt   = m.datetime.toDate();
  const pad  = n => String(n).padStart(2, "0");
  const localStr = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  document.getElementById("match-modal").classList.remove("hidden");
  document.getElementById("match-uid").value = matchId;
  document.getElementById("match-home").value = m.home;
  document.getElementById("match-away").value = m.away;
  document.getElementById("match-group").value = m.group;
  document.getElementById("match-stage").value = m.stage;
  document.getElementById("match-datetime").value = localStr;
}

async function enterScore(matchId, home, away) {
  const homeScore = parseInt(prompt(`Goles de ${home}:`));
  const awayScore = parseInt(prompt(`Goles de ${away}:`));
  if (isNaN(homeScore) || isNaN(awayScore)) { showAdminToast("Resultado inv\u00e1lido.", "error"); return; }
  await db.collection("matches").doc(matchId).update({
    scoreHome: homeScore, scoreAway: awayScore, status: "finished"
  });
  showAdminToast("Resultado guardado. Recalculando puntos...", "success");
  await recalcFromAdmin(matchId, homeScore, awayScore);
  await loadAdminMatches();
}

async function recalcFromAdmin(matchId, scoreHome, scoreAway) {
  const predsSnap = await db.collection("predictions").where("matchId", "==", matchId).get();

  // Recalcular puntos totales de cada usuario afectado desde cero
  const affectedUsers = new Set();
  predsSnap.docs.forEach(pd => affectedUsers.add(pd.data().userId));

  // Actualizar puntos de esta predicción
  const batch = db.batch();
  predsSnap.docs.forEach(pd => {
    const pred = pd.data();
    const pts  = calcPts({ home: pred.predictedHome, away: pred.predictedAway }, { home: scoreHome, away: scoreAway });
    batch.update(pd.ref, { points: pts });
  });
  await batch.commit();

  // Recalcular totales completos de cada usuario afectado
  const allMatches = await db.collection("matches").get();
  const matchMap   = {};
  allMatches.docs.forEach(d => { matchMap[d.id] = d.data(); });

  for (const uid of affectedUsers) {
    const allPreds = await db.collection("predictions").where("userId", "==", uid).get();
    let total = 0, exact = 0, result = 0;
    allPreds.docs.forEach(pd => {
      const p = pd.data();
      const m = matchMap[p.matchId];
      if (!m || m.status !== "finished") return;
      const pts = calcPts({ home: p.predictedHome, away: p.predictedAway }, { home: m.scoreHome, away: m.scoreAway });
      total += pts;
      if (pts === 3) exact++;
      if (pts === 1) result++;
    });
    await db.collection("users").doc(uid).update({
      totalPoints: total,
      exactPredictions: exact,
      resultPredictions: result
    });
  }
  showAdminToast("Puntos recalculados correctamente.", "success");
}

function calcPts(pred, actual) {
  if (pred.home === actual.home && pred.away === actual.away) return 3;
  if (Math.sign(pred.home - pred.away) === Math.sign(actual.home - actual.away)) return 1;
  return 0;
}

// ============================================================
//  PANEL: PREDICCIONES POR PARTIDO
// ============================================================
async function loadPredicciones() {
  const matchSel = document.getElementById("pred-match-select");
  if (matchSel.options.length <= 1) {
    const snap = await db.collection("matches").orderBy("datetime").get();
    snap.docs.forEach(d => {
      const m = d.data();
      if (m.status !== "finished") return;
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${m.dateStr} — ${m.home} vs ${m.away} (${m.scoreHome}-${m.scoreAway})`;
      matchSel.appendChild(opt);
    });
  }
}

document.getElementById("pred-match-select")?.addEventListener("change", async function() {
  const matchId = this.value;
  if (!matchId) return;
  const tbody = document.getElementById("pred-table-body");
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:#888">Cargando\u2026</td></tr>`;

  const matchDoc = await db.collection("matches").doc(matchId).get();
  const match    = matchDoc.data();
  const predsSnap = await db.collection("predictions").where("matchId", "==", matchId).get();
  const usersSnap = await db.collection("users").get();
  const userMap   = {};
  usersSnap.docs.forEach(d => { userMap[d.id] = d.data().displayName || d.data().username; });

  // Todos los usuarios
  const allUsers = usersSnap.docs.map(d => ({ uid: d.id, name: d.data().displayName || d.data().username }));
  const predMap  = {};
  predsSnap.docs.forEach(pd => {
    const p = pd.data();
    predMap[p.userId] = { home: p.predictedHome, away: p.predictedAway, points: p.points || 0 };
  });

  const rows = allUsers
    .map(u => ({
      name: u.name,
      pred: predMap[u.uid] || null,
      pts:  predMap[u.uid]
        ? calcPts({ home: predMap[u.uid].home, away: predMap[u.uid].away }, { home: match.scoreHome, away: match.scoreAway })
        : null
    }))
    .sort((a, b) => (b.pts ?? -1) - (a.pts ?? -1));

  tbody.innerHTML = rows.map(r => {
    const predStr = r.pred ? `${r.pred.home} - ${r.pred.away}` : `<span style="color:#555">Sin predicci\u00f3n</span>`;
    const ptsColor = r.pts === 3 ? "#06d6a0" : r.pts === 1 ? "#D4A017" : "#666";
    const ptsStr   = r.pts === null ? `<span style="color:#555">-</span>` : `<strong style="color:${ptsColor}">${r.pts} pts</strong>`;
    const badge    = r.pts === 3 ? `<span class="badge badge-on">\u2b50 Exacto</span>`
                   : r.pts === 1 ? `<span class="badge badge-admin">\u2714 Resultado</span>`
                   : r.pts === 0 ? `<span class="badge badge-off">\u2715 Fall\u00f3</span>`
                   : `<span style="color:#555">-</span>`;
    return `
    <tr>
      <td style="font-weight:600">${r.name}</td>
      <td style="text-align:center;font-family:monospace;font-size:1rem">${predStr}</td>
      <td style="text-align:center">${ptsStr}</td>
      <td style="text-align:center">${badge}</td>
    </tr>`;
  }).join("");

  // Resultado real destacado
  document.getElementById("pred-result-display").textContent =
    `Resultado real: ${match.home} ${match.scoreHome} - ${match.scoreAway} ${match.away}`;
});

// ============================================================
//  PANEL: PUNTOS SEMANALES
// ============================================================
async function loadSemanal() {
  const sel = document.getElementById("week-select");
  if (sel.options.length <= 1) buildWeekOptions();
  await renderWeek();
}

function buildWeekOptions() {
  const sel = document.getElementById("week-select");
  // Semanas del Mundial 2026 (lunes a domingo, hora SV)
  const weeks = [
    { label: "Semana 1 — 9 al 15 jun",  start: "2026-06-09", end: "2026-06-15" },
    { label: "Semana 2 — 16 al 22 jun", start: "2026-06-16", end: "2026-06-22" },
    { label: "Semana 3 — 23 al 29 jun", start: "2026-06-23", end: "2026-06-29" },
    { label: "Semana 4 — 30 jun al 6 jul", start: "2026-06-30", end: "2026-07-06" },
    { label: "Semana 5 — 7 al 13 jul",  start: "2026-07-07", end: "2026-07-13" },
    { label: "Semana 6 — 14 al 19 jul", start: "2026-07-14", end: "2026-07-19" },
  ];
  weeks.forEach((w, i) => {
    const opt = document.createElement("option");
    opt.value = JSON.stringify(w);
    opt.textContent = w.label;
    // Pre-seleccionar semana actual
    const today = new Date().toISOString().substring(0, 10);
    if (today >= w.start && today <= w.end) opt.selected = true;
    sel.appendChild(opt);
  });
}

document.getElementById("week-select")?.addEventListener("change", renderWeek);

async function renderWeek() {
  const sel = document.getElementById("week-select");
  if (!sel.value) return;
  const week = JSON.parse(sel.value);
  const tbody = document.getElementById("semanal-table-body");
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:#888">Calculando\u2026</td></tr>`;

  // Partidos de la semana
  // Traer todos los finalizados y filtrar por fecha en cliente
  const matchesSnap = await db.collection("matches")
    .where("status", "==", "finished")
    .get();

  const weekMatchIds = new Set();
  const matchMap     = {};
  matchesSnap.docs.forEach(d => {
    const m = d.data();
    if (m.dateStr >= week.start && m.dateStr <= week.end) {
      weekMatchIds.add(d.id);
      matchMap[d.id] = m;
    }
  });

  if (weekMatchIds.size === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#888">No hay partidos finalizados esta semana.</td></tr>`;
    document.getElementById("semanal-match-count").textContent = "0 partidos jugados esta semana";
    return;
  }

  document.getElementById("semanal-match-count").textContent =
    `${weekMatchIds.size} partido(s) jugado(s) esta semana`;

  // Predicciones de esos partidos
  const predsSnap = await db.collection("predictions").get();
  const usersSnap = await db.collection("users").where("disabled", "==", false).get();

  // Calcular puntos semanales por usuario
  const weekPoints = {};
  predsSnap.docs.forEach(pd => {
    const p = pd.data();
    if (!weekMatchIds.has(p.matchId)) return;
    const match = matchMap[p.matchId];
    if (!match) return;
    const pts = calcPts(
      { home: p.predictedHome, away: p.predictedAway },
      { home: match.scoreHome, away: match.scoreAway }
    );
    if (!weekPoints[p.userId]) weekPoints[p.userId] = { pts: 0, exact: 0, result: 0 };
    weekPoints[p.userId].pts    += pts;
    if (pts === 3) weekPoints[p.userId].exact++;
    if (pts === 1) weekPoints[p.userId].result++;
  });

  const rows = usersSnap.docs.map(d => {
    const u = d.data();
    const w = weekPoints[d.id] || { pts: 0, exact: 0, result: 0 };
    return { name: u.displayName || u.username, ...w };
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);

  tbody.innerHTML = rows.map((r, i) => {
    const medal = i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : `${i+1}`;
    const ptsColor = r.pts > 0 ? "#E3262B" : "#888";
    return `
    <tr>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem">${medal}</td>
      <td style="font-weight:600">${r.name}</td>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:${ptsColor}">${r.pts}</td>
      <td style="color:#888;font-size:.85rem">\uD83C\uDFAF ${r.exact}</td>
      <td style="color:#888;font-size:.85rem">\u2714\uFE0F ${r.result}</td>
    </tr>`;
  }).join("");
}

// ============================================================
//  PANEL: ACTIVIDAD
// ============================================================
async function loadActividad() {
  const tbody   = document.getElementById("actividad-table-body");
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#888">Cargando\u2026</td></tr>`;

  const usersSnap   = await db.collection("users").where("disabled", "==", false).get();
  const predsSnap   = await db.collection("predictions").get();
  const matchesSnap = await db.collection("matches").get();
  const totalM      = matchesSnap.size;

  const predCount = {};
  predsSnap.docs.forEach(d => {
    const uid = d.data().userId;
    predCount[uid] = (predCount[uid] || 0) + 1;
  });

  const rows = usersSnap.docs.map(d => {
    const u = d.data();
    return { name: u.displayName || u.username, count: predCount[d.id] || 0, points: u.totalPoints || 0 };
  }).sort((a, b) => b.count - a.count || b.points - a.points);

  const activos = rows.filter(r => r.count > 0).length;
  document.getElementById("stat-act-total").textContent    = rows.length;
  document.getElementById("stat-act-activos").textContent  = activos;
  document.getElementById("stat-act-inactivos").textContent = rows.length - activos;

  tbody.innerHTML = rows.map((r, i) => {
    const pct      = totalM > 0 ? Math.round((r.count / totalM) * 100) : 0;
    const barColor = r.count === 0 ? "#2a2a2a" : pct >= 50 ? "#06d6a0" : "#E3262B";
    const badge    = r.count === 0
      ? `<span class="badge badge-off">Sin actividad</span>`
      : `<span class="badge badge-on">Activo</span>`;
    return `
    <tr>
      <td style="color:#888;font-size:.8rem">${i+1}</td>
      <td style="font-weight:600">${r.name}</td>
      <td style="text-align:center">
        <strong style="color:${r.count===0?'#888':'#fff'}">${r.count}</strong>
        <span style="color:#888;font-size:.75rem"> / ${totalM}</span>
      </td>
      <td>
        <div style="background:#1c1c1c;height:6px;border-radius:0;overflow:hidden;width:100%">
          <div style="background:${barColor};height:6px;width:${pct}%"></div>
        </div>
        <span style="font-size:.7rem;color:#888">${pct}%</span>
      </td>
      <td>${badge}</td>
    </tr>`;
  }).join("");
}

// ============================================================
//  PANEL: STATS
// ============================================================
async function loadStats() {
  const usersSnap   = await db.collection("users").where("disabled","==",false).get();
  const matchesSnap = await db.collection("matches").where("status","==","finished").get();
  const predsSnap   = await db.collection("predictions").get();
  document.getElementById("stat-users").textContent        = usersSnap.size;
  document.getElementById("stat-matches-done").textContent = matchesSnap.size;
  document.getElementById("stat-predictions").textContent  = predsSnap.size;
  const users = usersSnap.docs.map(d => d.data()).sort((a,b) => (b.totalPoints||0)-(a.totalPoints||0));
  if (users.length)
    document.getElementById("stat-leader").textContent =
      `${users[0].displayName || users[0].username} (${users[0].totalPoints || 0} pts)`;
}

document.querySelector('[data-tab="stats"]')?.addEventListener("click", loadStats);

// ============================================================
//  RECALCULAR TODOS LOS PUNTOS (botón de emergencia)
// ============================================================
document.getElementById("btn-recalc-all")?.addEventListener("click", async () => {
  if (!confirm("\u00bfRecalcular puntos de TODOS los usuarios desde cero?")) return;
  showAdminToast("Recalculando\u2026 esto puede tardar unos segundos.", "info");

  const matchesSnap = await db.collection("matches").get();
  const matchMap    = {};
  matchesSnap.docs.forEach(d => { matchMap[d.id] = d.data(); });

  const usersSnap = await db.collection("users").get();
  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const ps  = await db.collection("predictions").where("userId", "==", uid).get();
    let total = 0, exact = 0, result = 0;
    const batch = db.batch();
    ps.docs.forEach(pd => {
      const p = pd.data();
      const m = matchMap[p.matchId];
      if (!m || m.status !== "finished") { batch.update(pd.ref, { points: 0 }); return; }
      const pts = calcPts({ home: p.predictedHome, away: p.predictedAway }, { home: m.scoreHome, away: m.scoreAway });
      total += pts;
      if (pts === 3) exact++;
      if (pts === 1) result++;
      batch.update(pd.ref, { points: pts });
    });
    await batch.commit();
    await db.collection("users").doc(uid).update({
      totalPoints: total, exactPredictions: exact, resultPredictions: result
    });
  }
  showAdminToast("\u2705 Puntos recalculados correctamente para todos.", "success");
  await loadStats();
});

// ============================================================
//  UTILIDADES
// ============================================================
function showAdminToast(msg, type = "info") {
  const toast = document.getElementById("admin-toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 4000);
}

document.getElementById("btn-admin-logout").addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "../index.html");
});
