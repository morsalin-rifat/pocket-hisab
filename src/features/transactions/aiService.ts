export const aiService = {
  parseText: (text: string) => {
    const input = text.toLowerCase();
    // ১. যেকোনো স্থান থেকে টাকা (অ্যামাউন্ট) খুঁজে বের করা
    const amountMatch = input.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    
    let category = "🛍️ Others";
    let type = "expense";
    let walletId = "Cash";

    // ২. ইনকাম/আয় ডিটেকশন
    if (/(salary|income|received|got|bonus|পেলাম|জমা|আসলো|দিল|পেলুম|পাঠালো)/.test(input)) {
      type = "income";
      category = "💰 Income";
    } 
    // ৩. ট্রান্সফার ডিটেকশন
    else if (/(cash out|transfer|ক্যাশ আউট|পাঠালাম|নিলাম)/.test(input)) {
      type = "transfer";
      category = "🔄 Transfer";
    }

    // ৪. ক্যাটাগরি ডিটেকশন (যদি ইনকাম না হয়)
    if (type === "expense") {
      if (/(bus|fare|rickshaw|uber|rent|ভাড়া|যাতায়াত|রিকশা|বাস)/.test(input)) category = "🚗 Transport";
      else if (/(food|tea|lunch|dinner|snacks|burger|pizza|খাবার|চা|নাস্তা|সিঙ্গারা)/.test(input)) category = "🍔 Food";
      else if (/(recharge|mobile|topup|phone|রিচার্জ|মোবাইল)/.test(input)) category = "📱 Recharge";
      else if (/(bazar|grocery|বাজার|সদাই)/.test(input)) category = "🛒 Grocery";
    }

    // ৫. ওয়ালেট ডিটেকশন
    if (input.includes("bkash") || input.includes("বিকাশ")) walletId = "bKash";
    if (input.includes("bank") || input.includes("ব্যাংক")) walletId = "Bank";

    return {
      amount, category, type, note: text, walletId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};