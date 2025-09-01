import React from 'react';
import { PropertyData } from '../types';

interface PropertyInputFormProps {
  title: string;
  propertyData: PropertyData;
  setPropertyData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const InputField: React.FC<{
  label: string;
  id: keyof PropertyData;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  suffix?: string;
}> = ({ label, id, value, onChange, prefix, suffix }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type="number"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
        placeholder="0"
      />
      {suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);


export const PropertyInputForm: React.FC<PropertyInputFormProps> = ({ title, propertyData, setPropertyData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-primary-800 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <InputField label="Purchase Price" id="purchasePrice" value={propertyData.purchasePrice} onChange={handleChange} prefix="$" />
        <InputField label="Down Payment" id="downPayment" value={propertyData.downPayment} onChange={handleChange} prefix="$" />
        <InputField label="Closing Costs" id="closingCosts" value={propertyData.closingCosts} onChange={handleChange} prefix="$" />
        <InputField label="Interest Rate" id="interestRate" value={propertyData.interestRate} onChange={handleChange} suffix="%" />
        <InputField label="Loan Term (Years)" id="loanTerm" value={propertyData.loanTerm} onChange={handleChange} suffix="yrs" />
        <InputField label="Gross Monthly Rent" id="monthlyRent" value={propertyData.monthlyRent} onChange={handleChange} prefix="$" />
        <InputField label="Property Taxes (Annual)" id="propertyTaxes" value={propertyData.propertyTaxes} onChange={handleChange} prefix="$" />
        <InputField label="Home Insurance (Annual)" id="homeInsurance" value={propertyData.homeInsurance} onChange={handleChange} prefix="$" />
        <InputField label="Maintenance (Annual)" id="maintenance" value={propertyData.maintenance} onChange={handleChange} prefix="$" />
        <InputField label="HOA Fees (Monthly)" id="hoaFees" value={propertyData.hoaFees} onChange={handleChange} prefix="$" />
        <InputField label="Vacancy Rate" id="vacancyRate" value={propertyData.vacancyRate} onChange={handleChange} suffix="%" />
        <InputField label="Appreciation (Annual)" id="appreciationRate" value={propertyData.appreciationRate} onChange={handleChange} suffix="%" />
      </div>
    </div>
  );
};