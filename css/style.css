/* ============================================================
   QUINIELA MUNDIAL 2026 — Ogilvy El Salvador
   Estilo: Profesional + Mundialista
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

/* ── Variables ────────────────────────────────────────────── */
:root {
  --red:       #e63946;
  --red-dark:  #b5202d;
  --gold:      #f4d03f;
  --gold-dark: #d4ac0d;
  --navy:      #0d1b2a;
  --navy-mid:  #1b2d42;
  --navy-light:#253d56;
  --green:     #06d6a0;
  --white:     #f8f9fa;
  --grey:      #adb5bd;
  --card-bg:   rgba(255,255,255,0.05);
  --card-border: rgba(255,255,255,0.10);
  --radius:    12px;
  --shadow:    0 4px 24px rgba(0,0,0,0.3);
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Outfit', sans-serif;
}

/* ── Reset ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--navy);
  color: var(--white);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Fondo animado ───────────────────────────────────────── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(230,57,70,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(244,208,63,0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(6,214,160,0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hidden { display: none !important; }

/* ── PANTALLA DE LOGIN ───────────────────────────────────── */
#screen-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  z-index: 1;
}

.login-card {
  background: var(--navy-mid);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
  text-align: center;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.login-logo .ball { font-size: 2.5rem; animation: spin 6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.login-logo .brand {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 2px;
  color: var(--gold);
  line-height: 1;
}

.login-logo .brand span { color: var(--red); }

.login-subtitle {
  font-size: 0.85rem;
  color: var(--grey);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.login-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--red), var(--gold), transparent);
  margin-bottom: 2rem;
  border-radius: 2px;
}

.login-field {
  text-align: left;
  margin-bottom: 1rem;
}

.login-field label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey);
  margin-bottom: 0.4rem;
}

.login-field input {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.login-field input:focus {
  outline: none;
  border-color: var(--gold);
}

.btn-login-main {
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(135deg, var(--red), var(--red-dark));
  color: var(--white);
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 2px;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-login-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(230,57,70,0.4);
}

#login-error {
  color: var(--red);
  font-size: 0.85rem;
  margin-top: 0.75rem;
  min-height: 1.2em;
}

/* ── APP PRINCIPAL ───────────────────────────────────────── */
#screen-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* Header */
.app-header {
  background: var(--navy-mid);
  border-bottom: 2px solid var(--red);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-brand {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 2px;
  color: var(--gold);
}

.header-brand span { color: var(--red); }

.header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--grey);
}

.avatar {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--red), var(--gold));
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--white);
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--grey);
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover { border-color: var(--red); color: var(--red); }

/* Nav */
.app-nav {
  background: var(--navy-light);
  display: flex;
  border-bottom: 1px solid var(--card-border);
}

.nav-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--grey);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.9rem 0.5rem 0.7rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.nav-btn .nav-icon { font-size: 1.2rem; }
.nav-btn:hover { color: var(--white); }
.nav-btn.active { color: var(--gold); border-bottom-color: var(--gold); }

/* Content */
.app-content {
  flex: 1;
  padding: 1.25rem 1rem 5rem;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

/* ── SECCIONES DE VISTAS ─────────────────────────────────── */
.view-header {
  margin-bottom: 1.25rem;
}

.view-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 1px;
  color: var(--white);
  line-height: 1.1;
}

.view-subtitle {
  font-size: 0.85rem;
  color: var(--grey);
  margin-top: 0.2rem;
}

/* ── TARJETA DE PARTIDO ─────────────────────────────────── */
.match-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.15s;
}

.match-card:hover { transform: translateY(-2px); }

.match-card.finished { border-color: rgba(6,214,160,0.3); }
.match-card.live { border-color: rgba(230,57,70,0.6); animation: pulse-border 1.5s infinite; }

@keyframes pulse-border {
  0%,100% { border-color: rgba(230,57,70,0.6); }
  50%      { border-color: rgba(230,57,70,1); }
}

.match-group-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  color: var(--white);
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.team {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.team.home { justify-content: flex-start; }
.team.away { justify-content: flex-end; flex-direction: row-reverse; }

.flag { font-size: 1.5rem; line-height: 1; }

.team-name {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
}

.match-center {
  text-align: center;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.match-time {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--gold);
}

.score-result {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--green);
  letter-spacing: 2px;
}

.vs-label {
  font-size: 0.65rem;
  color: var(--grey);
  letter-spacing: 2px;
}

/* Predicci\u00f3n */
.prediction-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  margin-top: 0.5rem;
}

.score-input {
  width: 52px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  color: var(--white);
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  padding: 0.35rem;
  font-family: var(--font-display);
  transition: border-color 0.2s;
}

.score-input:focus { outline: none; border-color: var(--gold); }
.score-input:disabled { opacity: 0.5; cursor: not-allowed; }

.score-input::-webkit-inner-spin-button,
.score-input::-webkit-outer-spin-button { -webkit-appearance: none; }

.dash { color: var(--grey); font-weight: 700; }

.btn-save-pred {
  margin-left: auto;
  background: linear-gradient(135deg, var(--red), var(--red-dark));
  color: var(--white);
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save-pred:hover { transform: scale(1.05); }

.lock-label {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--grey);
}

.points-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  margin-bottom: 0.4rem;
}

.pts-0 { background: rgba(255,255,255,0.1); color: var(--grey); }
.pts-1 { background: rgba(244,212,63,0.2); color: var(--gold); }
.pts-3 { background: rgba(6,214,160,0.2); color: var(--green); }

/* Date header */
.date-header {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 1px;
  color: var(--gold);
  margin: 1.25rem 0 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(244,212,63,0.2);
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.9rem;
}

.search-box input:focus { outline: none; }
.search-icon { color: var(--grey); }

/* ── LEADERBOARD ─────────────────────────────────────────── */
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey);
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.leaderboard-table td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 0.9rem;
}

.leaderboard-table tr:hover td { background: rgba(255,255,255,0.03); }

.my-row td { background: rgba(244,212,63,0.07) !important; }

.rank-cell { font-family: var(--font-display); font-size: 1.1rem; width: 2rem; }
.name-cell { font-weight: 600; }
.pts-cell  { font-family: var(--font-display); font-size: 1.2rem; color: var(--gold); }
.detail-cell { font-size: 0.8rem; color: var(--grey); }

.you-badge {
  display: inline-block;
  background: var(--gold);
  color: var(--navy);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  vertical-align: middle;
  margin-left: 0.3rem;
}

.scoring-legend {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--grey);
}

.legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}

/* ── TOAST ────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--navy-mid);
  border: 1px solid var(--card-border);
  color: var(--white);
  padding: 0.65rem 1.25rem;
  border-radius: 50px;
  font-size: 0.85rem;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  white-space: nowrap;
  z-index: 999;
}

.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.success { border-color: var(--green); }
.toast.error   { border-color: var(--red); }

/* Empty state */
.empty-state {
  text-align: center;
  color: var(--grey);
  padding: 3rem 1rem;
  font-size: 1rem;
}

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (min-width: 480px) {
  .team-name { font-size: 0.95rem; }
  .match-card { padding: 1.25rem; }
  .app-content { padding: 1.5rem 1.5rem 5rem; }
}
