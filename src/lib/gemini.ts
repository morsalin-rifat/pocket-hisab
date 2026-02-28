import { GoogleGenerativeAI } from "@google/generative-ai";

// আপনার এপিআই কী সরাসরি এখানে দেওয়া হয়েছে যাতে কোনো মিসিং না হয়
const API_KEY = "AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      Parse this text: "${text}". 
      Return ONLY a valid JSON object. Do not include any markdown, backticks, or extra text.
      JSON structure:
      {
        "amount": number,
        "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others",
        "type": "expense" | "income",
        "note": "short description",
        "walletId": "Cash" | "bKash" | "Bank"
      }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let rawText = response.text().trim();
      
      // ডাটা ক্লিনআপ: যদি এআই ব্যাকটিক দিয়ে ফেলে (```json ... ```)
      if (rawText.includes("{")) {
        rawText = rawText.substring(rawText.indexOf("{"), rawText.lastIndexOf("}") + 1);
      }
      
      return JSON.parse(rawText);
    } catch (e) {
      console.error("Gemini Error:", e);
      throw new Error("Link Failed");
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      Context: ${JSON.stringify(history.slice(0, 15))}.
      User Question: "${question}".
      Answer briefly in Bengali. High contrast, sharp professional tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};