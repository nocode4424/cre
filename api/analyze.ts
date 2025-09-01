import { GoogleGenAI } from "@google/genai";

// Self-contained type definition
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
    const { propertyData } = await request.json() as { propertyData: PropertyData };
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable not set on the server.");
      return new Response(JSON.stringify({ error: 'Server configuration error: API key not found.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
        You are a seasoned real estate investment advisor. Analyze the following investment property data and provide actionable advice.
        The user is looking for two types of recommendations:
        1. How to improve the performance of this specific property.
        2. A strategic analysis on whether they should consider selling this property to invest in a better one.

        **Property Financial Data:**
        - Purchase Price: $${propertyData.purchasePrice.toLocaleString()}
        - Down Payment: $${propertyData.downPayment.toLocaleString()}
        - Loan Interest Rate: ${propertyData.interestRate}%
        - Loan Term: ${propertyData.loanTerm} years
        - Gross Monthly Rent: $${propertyData.monthlyRent.toLocaleString()}
        - Annual Property Taxes: $${propertyData.propertyTaxes.toLocaleString()}
        - Annual Home Insurance: $${propertyData.homeInsurance.toLocaleString()}
        - Annual Maintenance Budget: $${propertyData.maintenance.toLocaleString()}
        - Vacancy Rate: ${propertyData.vacancyRate}%
        - HOA Fees: $${propertyData.hoaFees.toLocaleString()} per month
        - Closing Costs: $${propertyData.closingCosts.toLocaleString()}
        
        **Your Task:**
        
        Generate a response in two distinct sections. Use markdown for formatting.

        **Section 1: Improving Current Property Performance**
        - Provide a bulleted list of 3-5 specific, actionable recommendations to increase cash flow or ROI for this property.
        - For each recommendation, briefly explain the potential impact.
        - Recommendations could include adjusting rent (based on market assumptions), reducing specific expenses, or considering refinancing options.

        **Section 2: Strategic Sell vs. Hold Analysis**
        - Provide a paragraph analyzing the pros and cons of selling this property.
        - Discuss what a "better" investment opportunity might look like in terms of key metrics (e.g., higher Cap Rate, better cash-on-cash return).
        - Conclude with a strategic thought on when it makes sense for an investor to sell and reinvest.
    `;
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
    });
    
    return new Response(response.text, { status: 200, headers: { 'Content-Type': 'text/plain' } });

  } catch (error: any) {
    console.error("Error in /api/analyze handler:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
