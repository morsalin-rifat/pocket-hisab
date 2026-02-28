import { 
  collection, addDoc, query, where, onSnapshot, orderBy, Timestamp, getDocs, doc, setDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // ১. ট্রানজেকশন অ্যাড করা
  addTransaction: async (userId: string, data: any) => {
    return await addDoc(collection(db, "transactions"), {
      userId,
      amount: parseFloat(data.amount),
      category: data.category,
      note: data.note,
      walletId: data.walletId,
      date: Timestamp.now()
    });
  },

  // ২. ওয়ালেট অ্যাড করা
  addWallet: async (userId: string, wallet: any) => {
    return await addDoc(collection(db, "wallets"), {
      userId,
      name: wallet.name,
      balance: parseFloat(wallet.balance),
      icon: wallet.icon,
      color: wallet.color,
      createdAt: Timestamp.now()
    });
  },

  // ৩. রিয়েল-টাইম ডাটা শোনা (ট্রানজেকশন)
  subscribeTransactions: (userId: string, callback: any) => {
    const q = query(collection(db, "transactions"), where("userId", "==", userId), orderBy("date", "desc"));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  },

  // ৪. রিয়েল-টাইম ডাটা শোনা (ওয়ালেটস)
  subscribeWallets: (userId: string, callback: any) => {
    const q = query(collection(db, "wallets"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }
};