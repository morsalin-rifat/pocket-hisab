export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    let isTransfer = false;
    let fee = 0;
    
    // ১. ট্রান্সফার বা ক্যাশ আউট ডিটেকশন
    if (/(cash out|transfer|ক্যাশ আউট|পাঠালাম|নিলাম)/.test(input)) {
      isTransfer = true;
      category = "🔄 Transfer";
      // বিকাশের ক্যাশ আউট চার্জ সাধারণত ১.৮৫%
      if (input.includes("বিকাশ") || input.includes("bkash")) {
        fee = amount * 0.0185;
      }
    }
    // ২. আগের ক্যাটাগরিগুলো (সংক্ষিপ্ত)
    else if (/(bus|fare|ভাড়া|যাতায়াত)/.test(input)) category = "🚗 Transport";
    else if (/(food|tea|খাবার|চা)/.test(input)) category = "🍔 Food";
    else if (/(recharge|mobile|রিচার্জ)/.test(input)) category = "📱 Recharge";
    
    return {
      amount,
      category,
      note: text,
      isTransfer,
      fee: parseFloat(fee.toFixed(2)),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};