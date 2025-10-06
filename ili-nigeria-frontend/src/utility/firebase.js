import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
};
