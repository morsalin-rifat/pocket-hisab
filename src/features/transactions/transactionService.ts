import { 
  collection, addDoc, query, where, onSnapshot, orderBy, Timestamp 
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // এন্ট্রি সেভ করা
  addTransaction: async (userId: string, data: any) => {
    try {
      return await addDoc(collection(db, "transactions"), {
        userId,
        amount: Number(data.amount),
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash",
        date: Timestamp.now()
      });
    } catch (e) {
      console.error("Save Error:", e);
      throw e;
    }
  },

  // রিয়েল-টাইম লিসেনার
  subscribeTransactions: (userId: string, callback: (data: any[]) => void) => {
    // নোট: যদি ডাটা না দেখায়, তবে কনসোল চেক করুন। ফায়ারবেস একটি লিঙ্ক দিবে ইনডেক্স তৈরি করার জন্য।
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.error("Firestore Subscription Error:", error);
    });
  }
};