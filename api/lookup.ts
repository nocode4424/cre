import { GoogleGenAI } from "@google/genai";

// Self-contained type definitions to avoid pathing issues in serverless environments.
interface PropertyData {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  propertyTaxes: number;
  homeInsurance: number;
  maintenance: number;
  vacancyRate: number;
  appreciationRate: number;
  closingCosts: number;
  hoaFees: number;
}

interface FetchedPropertyAnalysis {
  propertyData: PropertyData;
  clarifyingQuestions: string[];
}

const MODEL_NAME = 'gemini-2.5-flash';

// Vercel specific configuration
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { address, propertyType } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable not set on the server.");
      return new Response(JSON.stringify({ error: 'Server configuration error: API key not found.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        You are a real estate data analysis tool. Your task is to find financial data for the property at the following address and of the specified type. Use Google Search to find the most accurate and up-to-date information possible.

        Address: "${address}"
        Property Type: "${propertyType}"

        Return your response as a single, raw JSON object, and nothing else. Do not wrap it in markdown backticks or any other formatting.

        The JSON object must have this exact structure:
        {
          "propertyData": {
            "purchasePrice": 0,
            "downPayment": 0,
            "interestRate": 0,
            "loanTerm": 30,
            "monthlyRent": 0,
            "propertyTaxes": 0,
            "homeInsurance": 0,
            "maintenance": 0,
            "vacancyRate": 5,
            "appreciationRate": 3,
            "closingCosts": 0,
            "hoaFees": 0
          },
          "clarifyingQuestions": [
            "Please confirm the estimated purchase price.",
            "What mortgage interest rate are you expecting?",
            "What is the estimated monthly rent for a property like this?"
          ]
        }

        Based on your search, fill in the number fields with your best estimates.
        - For 'purchasePrice', find an online estimate (e.g., Zillow) if possible.
        - For 'downPayment', calculate it as 20% of the purchasePrice.
        - For 'interestRate', use the current national average for a 30-year fixed mortgage.
        - For 'monthlyRent', find a local market estimate.
        - For 'propertyTaxes', estimate based on local tax rates and purchase price.
        - For 'homeInsurance', estimate based on national or regional averages.
        - For 'maintenance', estimate as 1% of the purchase price annually.
        - For 'closingCosts', estimate as 3% of the purchase price.
        - For 'hoaFees', estimate as 0 unless you find specific information for a condo/townhouse complex at the address.

        The 'clarifyingQuestions' array should contain questions for the user to verify your most important or uncertain estimates. Make them specific, mentioning the values you found. For example: "We estimated the annual property taxes to be $XXXX. Is this figure accurate?".
    `;
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const jsonText = response.text.trim();
    
    // Robust JSON parsing
    let parsed;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("AI did not return a valid JSON object.");
    }

    try {
        parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
        console.error("Failed to parse JSON from AI. Raw response:", jsonText);
        throw new Error(`The AI returned data in an unexpected format.`);
    }

    if (parsed.propertyData && parsed.clarifyingQuestions) {
        const requiredKeys: (keyof PropertyData)[] = [
            'purchasePrice', 'downPayment', 'interestRate', 'loanTerm',
            'monthlyRent', 'propertyTaxes', 'homeInsurance', 'maintenance',
            'vacancyRate', 'appreciationRate', 'closingCosts', 'hoaFees'
        ];
        for (const key of requiredKeys) {
            parsed.propertyData[key] = Number(parsed.propertyData[key]) || 0;
        }
        
        return new Response(JSON.stringify(parsed as FetchedPropertyAnalysis), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        throw new Error("Invalid JSON structure received from AI.");
    }

  } catch (error: any) {
    console.error("Error in /api/lookup handler:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
