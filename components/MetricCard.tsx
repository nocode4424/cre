import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, isCurrency, isPercentage }) => {
  const formatValue = () => {
    if (isNaN(value) || !isFinite(value)) {
      return 'N/A';
    }
    let formatted = value.toFixed(2);
    if (isCurrency) {
      formatted = `$${Number(value.toFixed(2)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (isPercentage) {
      formatted = `${value.toFixed(2)}%`;
    }
    return formatted;
  };
  
  const valueColorClass = value >= 0 ? 'text-positive' : 'text-negative';

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${valueColorClass}`}>{formatValue()}</p>
    </div>
  );
};
