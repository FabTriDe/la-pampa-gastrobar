// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - CONFIGURACIÓN FIREBASE
// Inicialización de Firebase y Firestore
// ═══════════════════════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ REEMPLAZA ESTO CON TUS CREDENCIALES DE FIREBASE
// Ve a Firebase Console → Proyecto → Configuración → SDK
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

// Inicializar Firebase
let app;
let auth;
let db;
let isFirebaseConfigured = false;

try {
  // Verificar si hay credenciales válidas
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseConfigured = true;
    console.log("✅ Firebase inicializado correctamente");
  } else {
    console.warn(
      "⚠️ Firebase no configurado. Crea .env.local con tus credenciales.",
    );
    console.warn("  Algunas funciones requerirán Firebase configurado.");
  }
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error.message);
  console.warn("⚠️ La app funcionará en modo demo, pero sin autenticación.");
}

export { auth, db, app, isFirebaseConfigured };
