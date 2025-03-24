import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { StockCandle } from '../types/stock';

interface Props {
  data: StockCandle[];
}

export const VolumeChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis />
        <Tooltip />
        <Bar dataKey="volume" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};
