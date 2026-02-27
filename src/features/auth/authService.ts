import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export const authService = {
  loginAsGuest: async () => {
    return await signInAnonymously(auth);
  },
  signUp: async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  },
  login: async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  },
  loginWithGoogle: async () => {
    return await signInWithPopup(auth, googleProvider);
  },
  logout: async () => {
    return await signOut(auth);
  },
  // ইউজার লগ-ইন আছে কি না চেক করার জন্য
  subscribeToAuthChanges: (callback: any) => {
    return onAuthStateChanged(auth, callback);
  }
};