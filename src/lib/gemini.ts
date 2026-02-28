import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      System: Act as a JSON API.
      User Text: "${text}"
      Task: Return ONLY a JSON object like this:
      {
        "amount": number,
        "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others",
        "type": "expense" | "income",
        "note": "short note",
        "walletId": "Cash" | "bKash" | "Bank"
      }
      Rule: No markdown, no backticks, no talk. JUST JSON.
    `;
    
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();
    
    // JSON Extraction (যদি জেমিনাই বাড়তি কিছু দিয়ে ফেলে)
    try {
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}') + 1;
      const jsonStr = rawText.slice(start, end);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("AI Output Error:", rawText);
      throw new Error("Parse Failed");
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      System: You are an AI Financial Oracle. Use this data: ${JSON.stringify(history.slice(0, 15))}.
      User Question: "${question}"
      Task: Answer very briefly in Bengali. High contrast, sharp tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};