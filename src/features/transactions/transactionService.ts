import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // ১. নতুন লেনদেন যোগ করা
  addTransaction: async (userId: string, data: any) => {
    const docRef = await addDoc(collection(db, "transactions"), {
      userId,
      amount: parseFloat(data.amount),
      category: data.category,
      note: data.note,
      wallet: data.wallet, // e.g., 'Cash'
      type: 'expense',
      date: Timestamp.now()
    });
    return docRef;
  },
  
  // ২. রিয়েল-টাইম লেনদেন লিস্ট দেখা
  subscribeTransactions: (userId: string, callback: any) => {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(list);
    });
  }
};