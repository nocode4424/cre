export interface PropertyData {
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

export interface CalculatedMetrics {
  monthlyMortgage: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  noi: number;
}

export enum ViewMode {
  COMPARE = 'COMPARE',
  ANALYZE = 'ANALYZE',
}

export enum AnalyzeStep {
  INITIAL = 'INITIAL',
  FETCHING_DATA = 'FETCHING_DATA',
  CONFIRM_DATA = 'CONFIRM_DATA',
  ANALYZING = 'ANALYZING',
  SHOW_RESULTS = 'SHOW_RESULTS'
}

export const propertyTypes = {
  SINGLE_FAMILY: 'Single Family Residential',
  MULTI_FAMILY: 'Multi-Family Residential',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed-Use Development',
  LAND: 'Raw Land',
  OTHER: 'Other'
};

export type PropertyType = typeof propertyTypes[keyof typeof propertyTypes];
