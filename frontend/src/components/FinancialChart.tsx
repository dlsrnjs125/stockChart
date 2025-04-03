import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FinancialResponse } from '../api/stockApi';

interface Props {
  data: FinancialResponse | null;
}

export const FinancialChart: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{ marginBottom: 24, maxWidth: 900 }}>
      <h3>📊 분기별 재무비율 변화</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.ratios.slice(0, 6).reverse()}>
          <XAxis dataKey="stac_yymm" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="lblt_rate" name="부채비율" fill="#8884d8" />
          <Bar dataKey="crnt_rate" name="유동비율" fill="#82ca9d" />
          <Bar dataKey="quck_rate" name="당좌비율" fill="#ffc658" />
          <Bar dataKey="bram_depn" name="고정비율" fill="#ff7f50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
