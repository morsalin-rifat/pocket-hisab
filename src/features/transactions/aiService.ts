export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    let type = "expense"; // ডিফল্ট খরচ
    let fee = 0;
    
    // ১. ইনকাম বা ক্যাশ-ইন ডিটেকশন (টাকা আসা)
    if (/(salary|income|cash in|পেলাম|জমা|আসলো|পেলুম|বোনাস)/.test(input)) {
      type = "income";
      category = "💰 Income";
    }
    // ২. ট্রান্সফার বা ক্যাশ আউট
    else if (/(cash out|transfer|ক্যাশ আউট|পাঠালাম)/.test(input)) {
      type = "transfer";
      category = "🔄 Transfer";
      if (input.includes("বিকাশ") || input.includes("bkash")) fee = amount * 0.0185;
    }
    // ৩. রেগুলার ক্যাটাগরি
    else if (/(bus|fare|ভাড়া|যাতায়াত)/.test(input)) category = "🚗 Transport";
    else if (/(food|tea|খাবার|চা|সিঙ্গারা)/.test(input)) category = "🍔 Food";
    
    return {
      amount,
      category,
      type,
      note: text,
      fee: parseFloat(fee.toFixed(2)),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};