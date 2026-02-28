export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const input = text.toLowerCase();
    
    let category = "🛍️ Others";
    
    // ১. যাতায়াত (Transport)
    if (/(bus|rickshaw|uber|pathao|ride|fare|rent|বাস|রিকশা|ভাড়া|যাতায়াত|ভাড়|ট্রেন|গাড়ি)/.test(input)) {
      category = "🚗 Transport";
    }
    // ২. খাবার (Food)
    else if (/(food|lunch|dinner|breakfast|tea|snacks|coffee|restaurant|hotel|burger|pizza|কাচ্চি|ভাত|খাবার|চা|নাস্তা|সিঙ্গারা|মিষ্টি)/.test(input)) {
      category = "🍔 Food";
    }
    // ৩. রিচার্জ ও বিল (Recharge & Bills)
    else if (/(recharge|topup|phone|mobile|internet|wifi|bill|electricity|gas|water|রিচার্জ|মোবাইল|বিকাশ|নগদ|বিল|কারেন্ট|ওয়াইফাই)/.test(input)) {
      category = "📱 Recharge/Bills";
    }
    // ৪. বাজার (Grocery)
    else if (/(grocery|market|bazar|oil|rice|soap|egg|বাজার|সদাই|চাল|ডাল|তেল|ডিম|সবজি|মাছ|মাংস)/.test(input)) {
      category = "🛒 Grocery";
    }
    // ৫. চিকিৎসা (Medical)
    else if (/(med|medicine|doctor|hospital|pharmacy|ঔষধ|মেডিসিন|ডাক্তার|হাসপাতাল)/.test(input)) {
      category = "💊 Medical";
    }
    
    return {
      amount,
      category,
      note: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};