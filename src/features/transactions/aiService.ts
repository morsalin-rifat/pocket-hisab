export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    let type = "expense";
    let walletId = "Cash"; 
    let toWalletId = ""; 
    let fee = 0;

    if (/(cash out|transfer|ক্যাশ আউট|পাঠালাম|নিলাম)/.test(input)) {
      type = "transfer";
      category = "🔄 Transfer";
      walletId = input.includes("bkash") || input.includes("বিকাশ") ? "bKash" : "Bank";
      toWalletId = "Cash";
      if (walletId === "bKash") fee = amount * 0.0185;
    } else if (/(salary|income|received|got|bonus|পেলাম|জমা|আসলো|দিল)/.test(input)) {
      type = "income";
      category = "💰 Income";
    }

    if (type === "expense") {
      if (/(bus|fare|ভাড়া|যাতায়াত|রিকশা)/.test(input)) category = "🚗 Transport";
      else if (/(food|tea|খাবার|চা|সিঙ্গারা|lunch|dinner)/.test(input)) category = "🍔 Food";
      else if (/(recharge|mobile|phone|রিচার্জ|মোবাইল)/.test(input)) category = "📱 Recharge";
    }

    return {
      amount, category, type, note: text, fee: parseFloat(fee.toFixed(2)),
      walletId, toWalletId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};