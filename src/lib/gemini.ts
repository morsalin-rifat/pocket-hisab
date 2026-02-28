import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  // এন্ট্রি প্রসেস করার জন্য
  analyzeInput: async (text: string) => {
    const prompt = `
      You are a finance assistant. Convert this user sentence into a JSON object.
      User text: "${text}"
      Required format: { "amount": number, "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others", "type": "expense" | "income", "note": "string", "walletId": "Cash" | "bKash" | "Bank" }
      Only return the JSON object, nothing else.
    `;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  },
  
  // ডাটা নিয়ে প্রশ্ন করার জন্য
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      You are a friendly personal finance expert. Based on this transaction history: ${JSON.stringify(history)}.
      Answer this user question in a short, smart way in Bengali: "${question}".
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};