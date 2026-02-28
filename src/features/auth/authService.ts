import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

// সেশন যেন রিফ্রেশ দিলেও না হারায় তার জন্য Persistence সেটআপ
setPersistence(auth, browserLocalPersistence);

export const authService = {
  loginAsGuest: async () => {
    const userCredential = await signInAnonymously(auth);
    const shortId = userCredential.user.uid.slice(-4).toUpperCase();
    await updateProfile(userCredential.user, { displayName: `Guest_${shortId}` });
    localStorage.setItem('isLoggedIn', 'true'); // লোকাল স্টোরেজে সেভ
    return userCredential.user;
  },
  
  signUp: async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    await sendEmailVerification(userCredential.user);
    localStorage.setItem('isLoggedIn', 'true');
    return userCredential.user;
  },
  
  login: async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    localStorage.setItem('isLoggedIn', 'true');
    return res;
  },
  
  loginWithGoogle: async () => {
    const res = await signInWithPopup(auth, googleProvider);
    localStorage.setItem('isLoggedIn', 'true');
    return res;
  },
  
  logout: async () => {
    localStorage.removeItem('isLoggedIn');
    return await signOut(auth);
  },
  
  subscribeToAuthChanges: (callback: any) => {
    return onAuthStateChanged(auth, callback);
  }
};