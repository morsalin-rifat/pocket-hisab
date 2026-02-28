import { 
  collection, addDoc, query, where, onSnapshot, orderBy, Timestamp 
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const transactionService = {
  // এন্ট্রি সেভ করার মেইন ফাংশন
  addTransaction: async (userId: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        userId: userId,
        amount: Number(data.amount), // স্ট্রিং থেকে নাম্বারে কনভার্ট
        category: data.category,
        note: data.note || "",
        walletId: data.walletId || "Cash",
        date: Timestamp.now()
      });
      console.log("Transaction saved with ID: ", docRef.id);
      return docRef;
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  },

  // রিয়েল-টাইম ডাটা লিস্ট
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