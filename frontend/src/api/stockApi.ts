import axios from 'axios';
import { StockCandle } from '../types/stock';

// src/api/stockApi.ts
export interface StockSummary {
  symbol: string;
  price: number;
  change: number;
  change_rate: number;
  open: number;
  high: number;
  low: number;
  previous_close: number;
  volume: number;
  trade_amount: number;
}

export const fetchStockSummary = async (query: string): Promise<StockSummary> => {
  const res = await fetch(`http://localhost:8000/stock/summary?query=${query}`);
  if (!res.ok) throw new Error('요약 정보 조회 실패');
  return res.json();
};


export async function fetchCandles(
  query: string,
  timeframe: 'daily' | 'weekly' | 'monthly'
): Promise<StockCandle[]> {
  try {
    const response = await axios.get(`http://localhost:8000/chart/${timeframe}?query=${query}`);
    return response.data;
  } catch (err) {
    console.error('❌ Error fetching stock data:', err);
    return [];
  }
}
