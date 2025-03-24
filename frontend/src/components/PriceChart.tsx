import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { StockCandle } from '../types/stock';

interface Props {
  data: StockCandle[];
}

export const PriceChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <XAxis dataKey="time" tickFormatter={(t) => `${t.slice(4, 6)}/${t.slice(6, 8)}`} />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
