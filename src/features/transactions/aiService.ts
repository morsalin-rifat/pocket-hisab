export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    let type = "expense";
    let fee = 0;

    if (/(salary|income|cash in|পেলাম|জমা|আসলো|বোনাস)/.test(input)) {
      type = "income";
      category = "💰 Income";
    } else if (/(cash out|transfer|ক্যাশ আউট|পাঠালাম)/.test(input)) {
      type = "transfer";
      category = "🔄 Transfer";
      if (input.includes("বিকাশ") || input.includes("bkash")) fee = amount * 0.0185;
    } else if (/(bus|fare|ভাড়া|যাতায়াত|রিকশা|উবার)/.test(input)) category = "🚗 Transport";
    else if (/(food|tea|খাবার|চা|সিঙ্গারা|নাস্তা)/.test(input)) category = "🍔 Food";
    else if (/(recharge|mobile|রিচার্জ|মোবাইল)/.test(input)) category = "📱 Recharge";

    return {
      amount, category, type, note: text, fee: parseFloat(fee.toFixed(2)),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};