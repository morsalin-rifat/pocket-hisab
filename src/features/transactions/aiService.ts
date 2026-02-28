export const aiService = {
  // ইউজারের কথা থেকে ডাটা বের করার লজিক (Regex & Keyword Mapping)
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/); // সংখ্যা বা টাকা খুঁজে বের করা
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    
    let category = "🛍️ Others";
    if (text.includes("বাস") || text.includes("রিকশা") || text.includes("ভাড়া") || text.includes("যাতায়াত")) {
      category = "🚗 Transport";
    } else if (text.includes("খাবার") || text.includes("চা") || text.includes("সিঙ্গারা") || text.includes("কাচ্চি") || text.includes("রেস্টুরেন্ট")) {
      category = "🍔 Food";
    } else if (text.includes("বাজার") || text.includes("সবজি") || text.includes("মাছ")) {
      category = "🛒 Grocery";
    } else if (text.includes("বিল") || text.includes("ওয়াইফাই") || text.includes("বিদ্যুৎ")) {
      category = "💡 Bills";
    }
    
    return {
      amount,
      category,
      note: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};