import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `Task: Parse "${text}" into JSON. Format: {"amount":number,"category":"Food"|"Transport"|"Recharge"|"Others","type":"expense"|"income","note":"string","walletId":"Cash"|"bKash"|"Bank"}`;
    
    try {
      const result = await model.generateContent(prompt);
      let rawText = result.response.text().trim();
      // জঞ্জাল মুক্ত করার জন্য স্লাইস লজিক
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}') + 1;
      return JSON.parse(rawText.slice(start, end));
    } catch (e) {
      // AI ফেইল করলে লোকাল ব্যাকআপ লজিক
      const amount = parseInt(text.match(/\d+/)?.[0] || "0");
      return {
        amount,
        category: text.includes("চা") || text.includes("খাবার") ? "🍔 Food" : "🛍️ Others",
        type: text.includes("পেলাম") || text.includes("salary") ? "income" : "expense",
        note: text,
        walletId: "Cash"
      };
    }
  },
  
  askAssistant: async (question: string, history: any[]) => {
    try {
      const prompt = `Data: ${JSON.stringify(history.slice(0,10))}. Question: "${question}". Answer in Bengali short.`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      return "সিস্টেম একটু বিজি, দয়া করে আবার চেষ্টা করুন।";
    }
  }
};