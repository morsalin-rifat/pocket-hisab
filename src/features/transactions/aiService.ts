export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    let type = "expense";
    let senderOrReceiver = "";
    let walletId = "Cash"; // ডিফল্ট
    
    // ১. ইনকাম ডিটেকশন (টাকা আসা)
    if (/(salary|income|cash in|received|got|bonus|পেলাম|জমা|আসলো|দিল|পেলুম|পাঠালো)/.test(input)) {
      type = "income";
      category = "💰 Income";
      
      // কে টাকা দিলো তা বের করার চেষ্টা (Simple logic)
      const fromMatch = input.match(/(from|gave|by|কাছ থেকে|দিল) ([\w\u0980-\u09FF]+)/);
      if (fromMatch) senderOrReceiver = fromMatch[2];
    }
    
    // ২. ওয়ালেট ডিটেকশন
    if (input.includes("bkash") || input.includes("বিকাশ")) walletId = "bKash";
    else if (input.includes("bank") || input.includes("ব্যাংক")) walletId = "Bank";
    
    // ৩. ক্যাটাগরি ডিটেকশন
    if (type === "expense") {
      if (/(bus|fare|ভাড়া|যাতায়াত|রিকশা)/.test(input)) category = "🚗 Transport";
      else if (/(food|tea|খাবার|চা|সিঙ্গারা)/.test(input)) category = "🍔 Food";
      else if (/(recharge|mobile|রিচার্জ|মোবাইল)/.test(input)) category = "📱 Recharge";
    }
    
    return {
      amount,
      category,
      type,
      note: text,
      sender: senderOrReceiver,
      walletId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};