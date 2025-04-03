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


export interface FinancialItem {
  stac_yymm: string;
  lblt_rate: number;
  lblt_status: string;
  bram_depn: number;
  bram_status: string;
  crnt_rate: number;
  crnt_status: string;
  quck_rate: number;
  quck_status: string;
}

export interface FinancialResponse {
  symbol: string;
  ratios: FinancialItem[];
}

export const fetchFinancialRatios = async (query: string): Promise<FinancialResponse> => {
  const res = await fetch(`http://localhost:8000/stock/financial?query=${query}`);
  if (!res.ok) throw new Error('재무비율 데이터 조회 실패');
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
