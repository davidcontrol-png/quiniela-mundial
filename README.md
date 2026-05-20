// ============================================================
//  QUINIELA MUNDIAL 2026 - Ogilvy El Salvador
//  firebase-config.js
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyCr1z_cVMlZKbe-nRbqG8EAKBv2SNv9IIw",
  authDomain:        "quiniela-ogilvysv.firebaseapp.com",
  projectId:         "quiniela-ogilvysv",
  storageBucket:     "quiniela-ogilvysv.firebasestorage.app",
  messagingSenderId: "763989880052",
  appId:             "1:763989880052:web:0ebe9d4104899775ba02a1"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();
