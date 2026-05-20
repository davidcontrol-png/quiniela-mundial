/* ============================================================
   ADMIN PANEL — Quiniela Mundial 2026
   ============================================================ */

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --red:       #e63946;
  --red-dark:  #b5202d;
  --gold:      #f4d03f;
  --navy:      #0d1b2a;
  --navy-mid:  #1b2d42;
  --navy-light:#253d56;
  --green:     #06d6a0;
  --white:     #f8f9fa;
  --grey:      #adb5bd;
  --card-bg:   rgba(255,255,255,0.04);
  --card-border: rgba(255,255,255,0.10);
  --radius:    10px;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Outfit', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-body);
  background: var(--navy);
  color: var(--white);
  min-height: 100vh;
}

.hidden { display: none !important; }

/* Header admin */
.admin-header {
  background: var(--navy-mid);
  border-bottom: 2px solid var(--gold);
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-brand {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 2px;
}

.admin-brand span { color: var(--gold); }
.admin-brand small { color: var(--red); font-size: 0.8rem; display: block; letter-spacing: 1px; }

.admin-user { font-size: 0.85rem; color: var(--grey); display: flex; align-items: center; gap: 0.75rem; }

.btn-admin-logout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--grey);
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-admin-logout:hover { border-color: var(--red); color: var(--red); }

/* Tabs */
.admin-tabs {
  display: flex;
  background: var(--navy-light);
  border-bottom: 1px solid var(--card-border);
  overflow-x: auto;
}

.admin-tab {
  background: transparent;
  border: none;
  color: var(--grey);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
}

.admin-tab:hover { color: var(--white); }
.admin-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

/* Content */
.admin-content {
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.admin-panel h2 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: 1px;
  margin-bottom: 1.25rem;
  color: var(--white);
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--red), var(--red-dark));
  color: var(--white);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(230,57,70,0.3); }

.btn-secondary {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--white);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover { background: var(--navy-light); }

/* Tabla admin */
.admin-table-wrap {
  overflow-x: auto;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.admin-table th {
  background: rgba(255,255,255,0.05);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey);
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 0.875rem;
}

.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: rgba(255,255,255,0.03); }

.badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-admin { background: rgba(244,212,63,0.2); color: var(--gold); }
.badge-user  { background: rgba(255,255,255,0.1); color: var(--grey); }
.badge-on    { background: rgba(6,214,160,0.2); color: var(--green); }
.badge-off   { background: rgba(230,57,70,0.2); color: var(--red); }

.btn-sm {
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  border-radius: 5px;
  border: 1px solid var(--card-border);
  background: transparent;
  color: var(--white);
  cursor: pointer;
  transition: all 0.15s;
  margin-right: 0.25rem;
}

.btn-edit  { border-color: var(--gold); color: var(--gold); }
.btn-edit:hover  { background: rgba(244,212,63,0.15); }
.btn-score { border-color: var(--green); color: var(--green); }
.btn-score:hover { background: rgba(6,214,160,0.15); }
.btn-reset { border-color: var(--grey); color: var(--grey); }
.btn-reset:hover { background: rgba(255,255,255,0.08); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-box {
  background: var(--navy-mid);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-box h3 {
  font-family: var(--font-display);
  font-size: 1.4rem;
  letter-spacing: 1px;
  margin-bottom: 1.25rem;
  color: var(--gold);
}

.form-field {
  margin-bottom: 0.9rem;
}

.form-field label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey);
  margin-bottom: 0.35rem;
}

.form-field input,
.form-field select {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1px solid var(--card-border);
  border-radius: 7px;
  padding: 0.65rem 0.85rem;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field select:focus { outline: none; border-color: var(--gold); }

.form-field select option { background: var(--navy-mid); }

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 0.9rem;
  cursor: pointer;
}

.form-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--gold); }

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--card-border);
  color: var(--grey);
  border-radius: 7px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-cancel:hover { border-color: var(--white); color: var(--white); }

/* Toast */
.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--navy-light);
  border: 1px solid var(--card-border);
  color: var(--white);
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  font-size: 0.85rem;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  z-index: 9999;
  white-space: nowrap;
}

.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.success { border-color: var(--green); }
.toast.error   { border-color: var(--red); }
.toast.info    { border-color: var(--gold); }

code {
  background: rgba(255,255,255,0.08);
  padding: 0.1em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  font-family: monospace;
}
