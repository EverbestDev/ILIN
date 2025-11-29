import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAK1iw0QWQUB2ndSCbbMzWr1YiYUh3sL6s",
  authDomain: "ili-nigeria.firebaseapp.com",
  projectId: "ili-nigeria",
  storageBucket: "ili-nigeria.firebasestorage.app",
  messagingSenderId: "354477016411",
  appId: "1:354477016411:web:879df68127c5dc75b4467e",
  measurementId: "G-3JYJT9KC0G",
};

const app = initializeApp(firebaseConfig);
// Debug: log used Firebase config to ensure the frontend is using the expected project
try {
  // Avoid printing secret tokens; print public config fields only
  const { apiKey, authDomain, projectId, appId } = firebaseConfig;
  console.info("Firebase initialized with config:", { apiKey, authDomain, projectId, appId });
} catch (e) {
  console.info("Firebase config logging failed", e);
}
export const auth = getAuth(app);
// Log auth.app options for runtime confirmation
try {
  console.info("Firebase auth.app.options:", auth?.app?.options || null);
} catch (e) {
  console.info("Firebase auth options logging failed:", e);
}
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
};
