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
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold">{label}</p>
          <p style={{ color: '#0D47A1' }}>{`Property A: ${payload[0].value.toFixed(2)}${label.includes('Rate') || label.includes('Return') ? '%' : ''}`}</p>
          <p style={{ color: '#2196F3' }}>{`Property B: ${payload[1].value.toFixed(2)}${label.includes('Rate') || label.includes('Return') ? '%' : ''}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-brand-primary mb-4">Metrics Comparison</h3>
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
            <Bar dataKey="Property A" fill="#0D47A1" />
            <Bar dataKey="Property B" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
