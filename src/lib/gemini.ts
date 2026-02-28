import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      Extract finance data from this: "${text}"
      Return ONLY a JSON object: 
      {
        "amount": number,
        "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others",
        "type": "expense" | "income",
        "note": "short summary",
        "walletId": "Cash" | "bKash" | "Bank"
      }
      Strict Rule: DO NOT include markdown, backticks, or any explanation. ONLY JSON.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      // JSON Extraction Logic (যদি AI কোড ব্লক দিয়ে দেয়)
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const cleanJson = responseText.slice(jsonStart, jsonEnd);
      
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("AI Link Error:", e);
      throw new Error("Link Failed");
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      Context: ${JSON.stringify(history.slice(0, 10))}.
      Question: "${question}"
      Task: Answer very briefly in Bengali. High contrast, sharp professional tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};