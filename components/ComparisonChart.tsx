import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalculatedMetrics } from '../types';

interface ComparisonChartProps {
  dataA: CalculatedMetrics;
  dataB: CalculatedMetrics;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ dataA, dataB }) => {
  const chartData = [
    {
      name: 'Monthly Cash Flow',
      'Property A': dataA.monthlyCashFlow,
      'Property B': dataB.monthlyCashFlow,
    },
    {
      name: 'Cash on Cash Return',
      'Property A': dataA.cashOnCashReturn,
      'Property B': dataB.cashOnCashReturn,
    },
    {
      name: 'Cap Rate',
      'Property A': dataA.capRate,
      'Property B': dataB.capRate,
    },
     {
      name: 'NOI (Annual)',
      'Property A': dataA.noi,
      'Property B': dataB.noi,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPercentage = label.includes('Rate') || label.includes('Return');
      const formatValue = (value: number) => {
        const fixedValue = value.toFixed(2);
        return isPercentage ? `${fixedValue}%` : `$${Number(fixedValue).toLocaleString()}`;
      }
      
      return (
        <div className="bg-white p-4 border rounded-xl shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          <p style={{ color: '#1E40AF' }} className="text-sm">{`Property A: ${formatValue(payload[0].value)}`}</p>
          <p style={{ color: '#3B82F6' }} className="text-sm">{`Property B: ${formatValue(payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-primary-800 mb-4">Metrics Comparison</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(tick) => (tick.toLocaleString())} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Property A" fill="#1E40AF" />
            <Bar dataKey="Property B" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};