import { PropertyData } from '../types';

export interface FetchedPropertyAnalysis {
  propertyData: PropertyData;
  clarifyingQuestions: string[];
}

/**
 * Calls the secure backend API to fetch property data using an address.
 * @param address The property address.
 * @param propertyType The type of the property.
 * @returns A promise that resolves to the fetched property data and clarifying questions.
 */
export const getPropertyDataFromAddress = async (address: string, propertyType: string): Promise<FetchedPropertyAnalysis> => {
  try {
    const response = await fetch('/api/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, propertyType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch property data from the server.');
    }

    return data;
  } catch (error: any) {
    console.error("Error in getPropertyDataFromAddress:", error);
    throw new Error(`Failed to retrieve property data. ${error.message}`);
  }
};

/**
 * Calls the secure backend API to get an investment analysis for the provided property data.
 * @param propertyData The financial data of the property.
 * @returns A promise that resolves to the AI-generated analysis as a string.
 */
export const getInvestmentAnalysis = async (propertyData: PropertyData): Promise<string> => {
   try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get analysis from the server.');
    }
    
    return await response.text();
  } catch (error: any) {
    console.error("Error in getInvestmentAnalysis:", error);
    throw new Error(`Failed to generate investment analysis. ${error.message}`);
  }
};