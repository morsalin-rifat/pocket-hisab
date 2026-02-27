import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

export const authService = {
  // ১. গেস্ট মোড (Anonymous Login)
  loginAsGuest: async () => {
    return await signInAnonymously(auth);
  },
  
  // ২. সাইন আপ ও ভেরিফিকেশন মেইল
  signUp: async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  },
  
  // ৩. ইমেইল লগ-ইন
  login: async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  },
  
  // ৪. গুগল লগ-ইন
  loginWithGoogle: async () => {
    return await signInWithPopup(auth, googleProvider);
  },
  
  // ৫. লগ-আউট
  logout: async () => {
    return await signOut(auth);
  }
};