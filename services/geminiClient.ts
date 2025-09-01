import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns a singleton instance of the GoogleGenAI client.
 * This prevents the app from crashing on load if the API key isn't available
 * and allows for graceful error handling in the UI.
 * @returns {GoogleGenAI} The initialized GoogleGenAI client.
 * @throws {Error} If the VITE_API_KEY environment variable is not set.
 */
export const getAiClient = (): GoogleGenAI => {
    if (!ai) {
        // For Vite apps, environment variables exposed to the client must be prefixed with VITE_
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
            // This error will be caught by the UI and displayed to the user.
            throw new Error("VITE_API_KEY environment variable not set. Please ensure it is configured in your deployment settings.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};