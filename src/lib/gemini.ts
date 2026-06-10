import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || (typeof window === "undefined" ? process.env.GEMINI_API_KEY : undefined) || "";

// Initialize the new @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: apiKey,
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

/**
 * Generic text helper – feeds system instruction + content history and returns plain text.
 */
export async function generateText(systemPrompt: string, contents: any, modelName = 'gemini-2.5-flash'): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ No GEMINI_API_KEY detected. Simulating advisor output for development.");
    return "This is a simulated AI Advisor response. To activate live responses, please configure your GEMINI_API_KEY in the environment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7, // Creative but professional
      }
    });

    return response.text || "No response generated.";
  } catch (err) {
    console.error("Gemini API generateText Error:", err);
    throw err;
  }
}


