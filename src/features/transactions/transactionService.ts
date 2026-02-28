import { collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  addTransaction: async (userId: string, data: any) => {
    try {
      return await addDoc(collection(db, "transactions"), {
        userId,
        amount: Number(data.amount),
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash", // Default Cash
        type: data.type || "expense", // expense, income, transfer
        fee: Number(data.fee || 0),
        date: Timestamp.now()
      });
    } catch (e) { throw e; }
  },
  
  subscribeTransactions: (userId: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};