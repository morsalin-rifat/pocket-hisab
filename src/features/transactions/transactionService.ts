import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  addTransaction: async (userId: string, data: any) => {
    try {
      return await addDoc(collection(db, "transactions"), {
        userId,
        amount: Number(data.amount),
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash",
        toWalletId: data.toWalletId || "",
        type: data.type || "expense",
        eventId: data.eventId || null, // ইভেন্ট আইডি থাকলে যোগ হবে
        fee: Number(data.fee || 0),
        date: Timestamp.now()
      });
    } catch (e) { throw e; }
  },
  
  // নতুন ইভেন্ট তৈরি করা
  createEvent: async (userId: string, name: string, budget: number) => {
    return await addDoc(collection(db, "events"), {
      userId,
      name,
      budget: Number(budget),
      isActive: true,
      createdAt: Timestamp.now()
    });
  },
  
  deleteTransaction: async (id: string) => {
    return await deleteDoc(doc(db, "transactions", id));
  },
  
  subscribeTransactions: (userId: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }
};