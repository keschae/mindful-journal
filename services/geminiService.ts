import { GoogleGenAI, Type } from "@google/genai";

export const analyzeJournalEntry = async (title: string, content: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following journal entry. 
    1. Provide a very brief 1-sentence summary.
    2. Detect the overall mood (one word, e.g., 'Reflective', 'Joyful', 'Anxious').
    3. Give a short, constructive, or stoic piece of advice based on the content (max 2 sentences).

    Entry Title: ${title}
    Entry Content: ${content}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            mood: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["summary", "mood", "advice"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
