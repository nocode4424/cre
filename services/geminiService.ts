import { getAiClient } from './geminiClient'; // Use the lazy-loading client
import { PropertyData } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

export interface FetchedPropertyAnalysis {
  propertyData: PropertyData;
  clarifyingQuestions: string[];
}

export const getPropertyDataFromAddress = async (address: string, propertyType: string): Promise<FetchedPropertyAnalysis> => {
    const ai = getAiClient(); // Get the initialized client
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
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed.propertyData && parsed.clarifyingQuestions) {
            // Ensure all fields are numbers, default to 0 if missing.
            const requiredKeys: (keyof PropertyData)[] = [
                'purchasePrice', 'downPayment', 'interestRate', 'loanTerm',
                'monthlyRent', 'propertyTaxes', 'homeInsurance', 'maintenance',
                'vacancyRate', 'appreciationRate', 'closingCosts', 'hoaFees'
            ];
            for (const key of requiredKeys) {
                parsed.propertyData[key] = Number(parsed.propertyData[key]) || 0;
            }
            return parsed as FetchedPropertyAnalysis;
        } else {
            throw new Error("Invalid JSON structure received from AI.");
        }

    } catch (error) {
        console.error("Error calling or parsing Gemini response:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
            throw error;
        }
        throw new Error("Failed to retrieve property data. The AI returned an unexpected format or an error occurred.");
    }
};

export const getInvestmentAnalysis = async (propertyData: PropertyData): Promise<string> => {
    const ai = getAiClient(); // Get the initialized client
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
    
    try {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
            throw error;
        }
        throw new Error("Failed to generate analysis from AI service.");
    }
};