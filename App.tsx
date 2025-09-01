import React, { useState, useMemo, useCallback } from 'react';
import { PropertyInputForm } from './components/PropertyInputForm';
import { MetricCard } from './components/MetricCard';
import { AnalysisResult } from './components/AnalysisResult';
import { ComparisonChart } from './components/ComparisonChart';
import { Loader } from './components/Loader';
import { AddressForm } from './components/AddressForm';
import { ClarificationBox } from './components/ClarificationBox';
import { getInvestmentAnalysis, getPropertyDataFromAddress } from './services/geminiService';
import { calculateMetrics } from './utils/calculations';
import { PropertyData, CalculatedMetrics, ViewMode, AnalyzeStep, PropertyType, propertyTypes } from './types';

const initialPropertyData: PropertyData = {
  purchasePrice: 300000,
  downPayment: 60000,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2500,
  propertyTaxes: 3600,
  homeInsurance: 1200,
  maintenance: 1500,
  vacancyRate: 5,
  appreciationRate: 3,
  closingCosts: 9000,
  hoaFees: 50,
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ANALYZE);
  const [analyzeStep, setAnalyzeStep] = useState<AnalyzeStep>(AnalyzeStep.INITIAL);
  const [propertyA, setPropertyA] = useState<PropertyData>(initialPropertyData);
  const [propertyB, setPropertyB] = useState<PropertyData>({ ...initialPropertyData, purchasePrice: 350000, monthlyRent: 2800 });
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const metricsA = useMemo(() => calculateMetrics(propertyA), [propertyA]);
  const metricsB = useMemo(() => calculateMetrics(propertyB), [propertyB]);

  const handleAddressSubmit = useCallback(async (address: string, propertyType: PropertyType) => {
    setIsLoading(true);
    setError('');
    setAnalyzeStep(AnalyzeStep.FETCHING_DATA);
    try {
      const { propertyData, clarifyingQuestions } = await getPropertyDataFromAddress(address, propertyType);
      setPropertyA(propertyData);
      setClarifyingQuestions(clarifyingQuestions);
      setAnalyzeStep(AnalyzeStep.CONFIRM_DATA);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching property data.');
      setAnalyzeStep(AnalyzeStep.INITIAL);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setAnalysisResult('');
    setAnalyzeStep(AnalyzeStep.ANALYZING);
    try {
      const result = await getInvestmentAnalysis(propertyA);
      setAnalysisResult(result);
      setAnalyzeStep(AnalyzeStep.SHOW_RESULTS);
    } catch (err) {
      setError('Failed to get analysis. Please check your API key and try again.');
      setAnalyzeStep(AnalyzeStep.CONFIRM_DATA);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [propertyA]);

  const resetAnalysis = () => {
    setAnalyzeStep(AnalyzeStep.INITIAL);
    setPropertyA(initialPropertyData);
    setAnalysisResult('');
    setError('');
    setClarifyingQuestions([]);
  };

  const renderMetrics = (metrics: CalculatedMetrics, title: string) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-brand-primary mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard title="Monthly Cash Flow" value={metrics.monthlyCashFlow} isCurrency />
        <MetricCard title="Annual Cash Flow" value={metrics.annualCashFlow} isCurrency />
        <MetricCard title="Cash on Cash Return" value={metrics.cashOnCashReturn} isPercentage />
        <MetricCard title="Cap Rate" value={metrics.capRate} isPercentage />
        <MetricCard title="Monthly Mortgage" value={metrics.monthlyMortgage} isCurrency />
        <MetricCard title="Net Operating Income" value={metrics.noi} isCurrency />
      </div>
    </div>
  );
  
  const renderAnalyzeView = () => {
    switch (analyzeStep) {
      case AnalyzeStep.INITIAL:
        return (
          <>
            <AddressForm onSubmit={handleAddressSubmit} isLoading={isLoading} />
            {error && <p className="text-negative mt-4 text-center">{error}</p>}
          </>
        );
      case AnalyzeStep.FETCHING_DATA:
         return (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg shadow-md">
                <div className="w-12 h-12"><Loader/></div>
                <p className="text-gray-600 mt-4 text-lg">Finding property data... This may take a moment.</p>
            </div>
        );
      case AnalyzeStep.CONFIRM_DATA:
      case AnalyzeStep.ANALYZING:
      case AnalyzeStep.SHOW_RESULTS:
        return (
          <div className="space-y-8">
             <div className="flex justify-end">
                <button onClick={resetAnalysis} className="text-sm font-semibold text-brand-secondary hover:underline transition-colors">Start New Analysis</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <ClarificationBox questions={clarifyingQuestions} />
                <PropertyInputForm title="Confirm & Refine Property Data" propertyData={propertyA} setPropertyData={setPropertyA} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md lg:sticky top-8">
                <h3 className="text-xl font-bold text-brand-primary mb-4">AI-Powered Analysis</h3>
                <button
                  onClick={handleAnalysis}
                  disabled={isLoading || analyzeStep === AnalyzeStep.ANALYZING}
                  className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 flex items-center justify-center"
                >
                  {analyzeStep === AnalyzeStep.ANALYZING ? <Loader/> : 'Generate Recommendations'}
                </button>
                {error && <p className="text-negative mt-4">{error}</p>}
                
                {analyzeStep === AnalyzeStep.ANALYZING && (
                  <div className="text-center mt-4">
                    <p className="text-gray-600">Analyzing your property...</p>
                  </div>
                )}

                {analyzeStep === AnalyzeStep.SHOW_RESULTS && analysisResult && <AnalysisResult result={analysisResult} />}
              </div>
            </div>
            {renderMetrics(metricsA, "Live Property Metrics")}
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-brand-primary shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Real Estate Investment Analyzer</h1>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex justify-center space-x-2 sm:space-x-4" role="tablist" aria-label="Application modes">
            <button
              onClick={() => { setViewMode(ViewMode.ANALYZE); resetAnalysis(); }}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent ${viewMode === ViewMode.ANALYZE ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              role="tab"
              aria-selected={viewMode === ViewMode.ANALYZE}
            >
              Analyze Property
            </button>
            <button
              onClick={() => setViewMode(ViewMode.COMPARE)}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent ${viewMode === ViewMode.COMPARE ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              role="tab"
              aria-selected={viewMode === ViewMode.COMPARE}
            >
              Compare Properties
            </button>
          </div>
        </div>
        
        {viewMode === ViewMode.ANALYZE ? renderAnalyzeView() : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PropertyInputForm title="Property A" propertyData={propertyA} setPropertyData={setPropertyA} />
              <PropertyInputForm title="Property B" propertyData={propertyB} setPropertyData={setPropertyB} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {renderMetrics(metricsA, "Property A Metrics")}
              {renderMetrics(metricsB, "Property B Metrics")}
            </div>
            <ComparisonChart dataA={metricsA} dataB={metricsB} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
