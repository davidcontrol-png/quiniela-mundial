// ============================================================
//  QUINIELA OGILVY 2026 - Panel Admin
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
    const panelId = `panel-${tab.dataset.tab}`;
    document.getElementById(panelId).classList.remove("hidden");
    if (tab.dataset.tab === "actividad") loadActividad();
  });
});

async function initAdmin() {
  await Promise.all([loadAdminUsers(), loadAdminMatches()]);
}

// ============================================================
//  PANEL: USUARIOS
// ============================================================
async function loadAdminUsers() {
  const snap = await db.collection("users").orderBy("displayName").get();
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
        <button class="btn-sm btn-reset" onclick="resetPassword('${doc.id}','${u.email}')">Reset Pass</button>
      </td>
    </tr>`;
  }).join("");
}

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

async function resetPassword(uid, email) {
  if (!confirm(`\u00bfEnviar correo de reset a ${email}?`)) return;
  try {
    await auth.sendPasswordResetEmail(email);
    showAdminToast("Correo de reset enviado.", "success");
  } catch(e) { showAdminToast("Error: " + e.message, "error"); }
}

// ============================================================
//  PANEL: PARTIDOS
// ============================================================
async function loadAdminMatches() {
  const snap = await db.collection("matches").orderBy("datetime").get();
  const tbody = document.getElementById("matches-table-body");
  tbody.innerHTML = snap.docs.map(doc => {
    const m = doc.data();
    const dtStr = m.datetime?.toDate
      ? m.datetime.toDate().toLocaleString("es-SV", {timeZone:"America/El_Salvador",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})
      : "-";
    const scoreStr = m.status === "finished" ? `${m.scoreHome}-${m.scoreAway}` : "-";
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
    dateStr: dtVal.substring(0,10), timeStr: dtVal.substring(11,16),
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
  const pad  = n => String(n).padStart(2,"0");
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
  const predsSnap = await db.collection("predictions").where("matchId","==",matchId).get();
  const batch = db.batch();
  const userUpdates = {};
  predsSnap.docs.forEach(pd => {
    const pred = pd.data();
    const pts  = calcPts({ home: pred.predictedHome, away: pred.predictedAway }, { home: scoreHome, away: scoreAway });
    batch.update(pd.ref, { points: pts });
    if (!userUpdates[pred.userId]) userUpdates[pred.userId] = 0;
    userUpdates[pred.userId] += pts;
  });
  await batch.commit();
  for (const [uid, pts] of Object.entries(userUpdates)) {
    await db.collection("users").doc(uid).update({
      totalPoints: firebase.firestore.FieldValue.increment(pts)
    });
  }
  showAdminToast("Puntos actualizados.", "success");
}

function calcPts(pred, actual) {
  if (pred.home === actual.home && pred.away === actual.away) return 3;
  return Math.sign(pred.home - pred.away) === Math.sign(actual.home - actual.away) ? 1 : 0;
}

// ============================================================
//  PANEL: ACTIVIDAD — predicciones por usuario
// ============================================================
async function loadActividad() {
  const tbody  = document.getElementById("actividad-table-body");
  const total  = document.getElementById("stat-act-total");
  const activos = document.getElementById("stat-act-activos");
  const inact  = document.getElementById("stat-act-inactivos");

  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#888">Cargando\u2026</td></tr>`;

  // Traer todos los usuarios
  const usersSnap = await db.collection("users").where("disabled","==",false).get();
  const users = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));

  // Traer todas las predicciones de una sola vez
  const predsSnap = await db.collection("predictions").get();

  // Contar predicciones por usuario
  const predCount = {};
  predsSnap.docs.forEach(d => {
    const uid = d.data().userId;
    predCount[uid] = (predCount[uid] || 0) + 1;
  });

  // Total de partidos disponibles
  const matchesSnap = await db.collection("matches").get();
  const totalMatches = matchesSnap.size;

  // Armar filas ordenadas por predicciones desc
  const rows = users.map(u => ({
    name:   u.displayName || u.username,
    username: u.username,
    count:  predCount[u.uid] || 0,
    points: u.totalPoints || 0,
    uid:    u.uid
  })).sort((a,b) => b.count - a.count || b.points - a.points);

  const totalUsers   = rows.length;
  const activosCount = rows.filter(r => r.count > 0).length;
  const inactCount   = totalUsers - activosCount;

  total.textContent   = totalUsers;
  activos.textContent = activosCount;
  inact.textContent   = inactCount;

  tbody.innerHTML = rows.map((r, i) => {
    const pct     = totalMatches > 0 ? Math.round((r.count / totalMatches) * 100) : 0;
    const barColor = r.count === 0 ? "#2a2a2a" : r.count >= totalMatches * 0.5 ? "#06d6a0" : "#E3262B";
    const badge   = r.count === 0
      ? `<span class="badge badge-off">Sin actividad</span>`
      : `<span class="badge badge-on">Activo</span>`;
    return `
    <tr>
      <td style="color:#888;font-size:0.8rem">${i+1}</td>
      <td style="font-weight:600">${r.name}</td>
      <td style="text-align:center">
        <strong style="color:${r.count===0?'#888':'#fff'}">${r.count}</strong>
        <span style="color:#888;font-size:0.75rem"> / ${totalMatches}</span>
      </td>
      <td>
        <div style="background:#1c1c1c;height:6px;border-radius:0;overflow:hidden;width:100%">
          <div style="background:${barColor};height:6px;width:${pct}%;transition:width 0.5s"></div>
        </div>
        <span style="font-size:0.7rem;color:#888">${pct}%</span>
      </td>
      <td>${badge}</td>
    </tr>`;
  }).join("");
}

// ============================================================
//  PANEL: STATS / RESUMEN
// ============================================================
async function loadStats() {
  const usersSnap   = await db.collection("users").where("disabled","==",false).get();
  const matchesSnap = await db.collection("matches").where("status","==","finished").get();
  const predsSnap   = await db.collection("predictions").get();
  document.getElementById("stat-users").textContent        = usersSnap.size;
  document.getElementById("stat-matches-done").textContent = matchesSnap.size;
  document.getElementById("stat-predictions").textContent  = predsSnap.size;
  const users = usersSnap.docs.map(d => d.data()).sort((a,b) => (b.totalPoints||0)-(a.totalPoints||0));
  if (users.length) {
    document.getElementById("stat-leader").textContent =
      `${users[0].displayName || users[0].username} (${users[0].totalPoints || 0} pts)`;
  }
}

document.querySelector('[data-tab="stats"]')?.addEventListener("click", loadStats);

// ============================================================
//  UTILIDADES
// ============================================================
function showAdminToast(msg, type = "info") {
  const toast = document.getElementById("admin-toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}

document.getElementById("btn-admin-logout").addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "../index.html");
});
