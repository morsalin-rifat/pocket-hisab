import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // ১. লেনদেন যোগ করা
  addTransaction: async (userId: string, data: any) => {
    try {
      return await addDoc(collection(db, "transactions"), {
        userId,
        amount: Number(data.amount),
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash",
        type: data.type || "expense", // income, expense, transfer
        fee: Number(data.fee || 0),
        date: Timestamp.now()
      });
    } catch (e) { throw e; }
  },
  
  // ২. রিয়েল-টাইম ডাটা সিঙ্ক
  subscribeTransactions: (userId: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};