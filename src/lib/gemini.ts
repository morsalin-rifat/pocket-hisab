import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      Task: Parse user expense/income text into JSON.
      Input: "${text}"
      Return ONLY this JSON format:
      {
        "amount": number,
        "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others",
        "type": "expense" | "income",
        "note": "brief summary",
        "walletId": "Cash" | "bKash" | "Bank"
      }
      Strict Rules: No markdown, no code blocks, no text explanations. Just pure JSON.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim().replace(/```json|```/g, "");
      return JSON.parse(rawText);
    } catch (e) {
      console.error("AI Link Error:", e);
      throw new Error("Failed to link with AI");
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      You are a smart financial advisor. User history: ${JSON.stringify(history.slice(0, 15))}.
      Question: "${question}"
      Answer in Bengali, stay professional, short, and use high-contrast formatting.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};