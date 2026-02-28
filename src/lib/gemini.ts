import { GoogleGenerativeAI } from "@google/generative-ai";

// আপনার দেওয়া এপিআই কী সরাসরি বসানো হয়েছে
const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" } // জেমিনাইকে সরাসরি JSON দিতে বাধ্য করা
});

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      Extract finance info from: "${text}".
      Return raw JSON only: { "amount": number, "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others", "type": "expense" | "income", "note": "string", "walletId": "Cash" | "bKash" | "Bank" }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let rawText = response.text().trim();
      
      // যেকোনো বাড়তি ক্যারেক্টার বা মার্কডাউন ক্লিন করা
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "");
      
      return JSON.parse(rawText);
    } catch (e) {
      console.error("Gemini Parse Error:", e);
      throw e;
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      Data: ${JSON.stringify(history.slice(0, 15))}.
      Answer this: "${question}" shortly in Bengali. No markdown.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};