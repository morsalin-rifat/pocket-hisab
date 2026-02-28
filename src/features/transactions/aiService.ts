export const aiService = {
  parseText: (text: string) => {
    const amountMatch = text.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    const lowerText = text.toLowerCase();
    
    let category = "🛍️ Others"; // ডিফল্ট
    
    // স্মার্ট ক্যাটাগরি ডিটেকশন লজিক
    if (lowerText.includes("রিচার্জ") || lowerText.includes("recharge") || lowerText.includes("মোবাইল") || lowerText.includes("phone")) {
      category = "📱 Recharge";
    } else if (lowerText.includes("চা") || lowerText.includes("tea") || lowerText.includes("সিঙ্গারা") || lowerText.includes("নাস্তা") || lowerText.includes("snacks")) {
      category = "☕ Tea & Snacks";
    } else if (lowerText.includes("বাস") || lowerText.includes("রিকশা") || lowerText.includes("ভাড়া") || lowerText.includes("transport") || lowerText.includes("যাতায়াত")) {
      category = "🚗 Transport";
    } else if (lowerText.includes("কাচ্চি") || lowerText.includes("ভাত") || lowerText.includes("lunch") || lowerText.includes("dinner") || lowerText.includes("খাবার")) {
      category = "🍔 Meal/Food";
    } else if (lowerText.includes("বাজার") || lowerText.includes("grocery") || lowerText.includes("সবজি")) {
      category = "🛒 Grocery";
    } else if (lowerText.includes("ওয়াইফাই") || lowerText.includes("wifi") || lowerText.includes("বিল") || lowerText.includes("bill") || lowerText.includes("বিদ্যুৎ")) {
      category = "💡 Bills";
    } else if (lowerText.includes("ঔষধ") || lowerText.includes("medicine") || lowerText.includes("ডাক্তার") || lowerText.includes("doctor")) {
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