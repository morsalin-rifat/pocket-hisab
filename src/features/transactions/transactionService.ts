import { 
  collection, addDoc, query, where, onSnapshot, Timestamp 
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // ১. ডাটা সেভ করা (Force Number conversion)
  addTransaction: async (userId: string, data: any) => {
    try {
      return await addDoc(collection(db, "transactions"), {
        userId: userId,
        amount: Number(data.amount), // স্ট্রিং থেকে নাম্বারে কনভার্ট নিশ্চিত করা
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash",
        date: Timestamp.now()
      });
    } catch (e) {
      console.error("Save failed:", e);
      throw e;
    }
  },

  // ২. রিয়েল-টাইম লিসেনার (ইনডেক্স সমস্যা এড়াতে orderBy সরানো হয়েছে)
  subscribeTransactions: (userId: string, callback: (data: any[]) => void) => {
    // এখানে শুধু userId দিয়ে ফিল্টার করছি, এতে ইনডেক্স লাগবে না
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(data);
    }, (error) => {
      alert("Firestore error: " + error.message);
    });
  }
};