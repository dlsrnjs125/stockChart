import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProfitabilityResponse } from '../api/stockApi';

interface Props {
  data: ProfitabilityResponse | null;
}

export const ProfitabilityChart: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const filtered = data.ratios
    .filter(r => r.roe !== null || r.operating_margin !== null || r.net_margin !== null)
    .slice(0, 6)
    .reverse();

  if (filtered.length === 0) return null;

  return (
    <div style={{ marginBottom: 24, maxWidth: 900 }}>
      <h3>📊 분기별 수익성 비율 추이</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filtered}>
          <XAxis dataKey="stac_yymm" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="roe" name="ROE" fill="#8884d8" />
          <Bar dataKey="operating_margin" name="영업이익률" fill="#82ca9d" />
          <Bar dataKey="net_margin" name="순이익률" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
