import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export const authService = {
  // ১. গেস্ট মোড (Anonymous Login with Unique ID)
  loginAsGuest: async () => {
    const userCredential = await signInAnonymously(auth);
    const shortId = userCredential.user.uid.slice(-4).toUpperCase();
    await updateProfile(userCredential.user, {
      displayName: `Guest_${shortId}`
    });
    return userCredential.user;
  },
  
  // ২. সাইন আপ (নাম সহ)
  signUp: async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, {
      displayName: name
    });
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
  
  subscribeToAuthChanges: (callback: any) => {
    return onAuthStateChanged(auth, callback);
  }
};