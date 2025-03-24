import React, { useEffect, useState } from 'react';
import { fetchCandles } from '../api/stockApi';
import { StockCandle } from '../types/stock';
import { D3CandlestickChart } from './D3CandlestickChart';

const symbols = [
  { code: '005930', name: '삼성전자' },
  { code: '000660', name: 'SK하이닉스' },
  { code: '035720', name: '카카오' }
];

export const ChartWrapper: React.FC = () => {
  const [data, setData] = useState<StockCandle[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [symbol, setSymbol] = useState('005930');

  useEffect(() => {
    fetchCandles(symbol, timeframe).then(setData);
  }, [symbol, timeframe]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{symbols.find((s) => s.code === symbol)?.name} 차트</h2>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>
          종목:
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {symbols.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          단위:
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)}>
            <option value="daily">일</option>
            <option value="weekly">주</option>
            <option value="monthly">월</option>
          </select>
        </label>
      </div>

      <D3CandlestickChart data={data} symbol={symbol} timeframe={timeframe} />
    </div>
  );
};
