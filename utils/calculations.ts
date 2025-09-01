import { PropertyData, CalculatedMetrics } from '../types';

export const calculateMetrics = (data: PropertyData): CalculatedMetrics => {
  const {
    purchasePrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    propertyTaxes,
    homeInsurance,
    maintenance,
    vacancyRate,
    closingCosts,
    hoaFees,
  } = data;

  // Loan and Mortgage
  const loanAmount = purchasePrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  let monthlyMortgage = 0;
  if (monthlyInterestRate > 0) {
    monthlyMortgage = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  } else {
    monthlyMortgage = loanAmount / numberOfPayments;
  }
  monthlyMortgage = isNaN(monthlyMortgage) || !isFinite(monthlyMortgage) ? 0 : monthlyMortgage;


  // Income
  const grossMonthlyRent = monthlyRent;
  const annualGrossRent = grossMonthlyRent * 12;
  const vacancyLoss = annualGrossRent * (vacancyRate / 100);
  const effectiveGrossIncome = annualGrossRent - vacancyLoss;

  // Expenses
  const annualPropertyTaxes = propertyTaxes;
  const annualInsurance = homeInsurance;
  const annualMaintenance = maintenance;
  const annualHoaFees = hoaFees * 12;
  const annualOperatingExpenses = annualPropertyTaxes + annualInsurance + annualMaintenance + annualHoaFees + vacancyLoss;

  // Net Operating Income (NOI)
  const noi = effectiveGrossIncome - (annualPropertyTaxes + annualInsurance + annualMaintenance + annualHoaFees);
  
  // Cash Flow
  const monthlyOperatingExpenses = annualOperatingExpenses / 12;
  const totalMonthlyExpenses = monthlyMortgage + monthlyOperatingExpenses - vacancyLoss/12;
  const monthlyCashFlow = grossMonthlyRent - totalMonthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Returns
  const totalCashInvested = downPayment + closingCosts;
  const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  return {
    monthlyMortgage,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn: isNaN(cashOnCashReturn) || !isFinite(cashOnCashReturn) ? 0 : cashOnCashReturn,
    capRate: isNaN(capRate) || !isFinite(capRate) ? 0 : capRate,
    noi,
  };
};
