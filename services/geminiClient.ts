import { GoogleGenAI } from "@google/genai";

// The API key is expected to be available in the execution environment.
// The GoogleGenAI constructor will use the provided process.env.API_KEY.
// If the key is missing or invalid, the library itself will throw an error upon an API call.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
