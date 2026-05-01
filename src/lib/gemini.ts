import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the new @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generic helper – feeds a system instruction + user string and returns JSON.
 * Returns raw response text; callers are responsible for JSON.parse().
 */
export async function generate<T>(systemPrompt: string, userPrompt: string, modelName = 'gemini-2.5-pro'): Promise<T> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ No GEMINI_API_KEY detected. Simulating audit output for development.");
    return {} as T;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // Low temperature for deterministic structures
        responseMimeType: "application/json", // Force JSON output
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw err;
  }
}

