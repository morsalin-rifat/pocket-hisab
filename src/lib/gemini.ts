import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDfia6hhF5XcPmJpoqDlzP8cPgAl3tMqNE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const geminiService = {
  analyzeInput: async (text: string) => {
    const prompt = `
      You are a precise finance engine. Task: Convert user text into JSON.
      User text: "${text}"
      JSON Format: { "amount": number, "category": "🍔 Food" | "🚗 Transport" | "📱 Recharge" | "🛍️ Others", "type": "expense" | "income", "note": "string", "walletId": "Cash" | "bKash" | "Bank" }
      IMPORTANT: Return ONLY the JSON object. No explanations or markdown.
    `;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON (Markdown স্লাশ বা বাড়তি লেখা সরানোর জন্য)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid Response");
    return JSON.parse(jsonMatch[0]);
  },
  
  askAssistant: async (question: string, history: any[]) => {
    const prompt = `
      You are a friendly personal finance guru. 
      Data: ${JSON.stringify(history.slice(0, 20))}.
      Answer this: "${question}" in Bengali concisely with high-contrast tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
};