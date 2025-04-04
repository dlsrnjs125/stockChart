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


export interface ProfitabilityItem {
  stac_yymm: string;
  roe: number;
  roa: number;
  operating_margin: number;
  net_margin: number;
}

export interface ProfitabilityResponse {
  symbol: string;
  ratios: ProfitabilityItem[];
}

export const fetchProfitabilityRatios = async (query: string): Promise<ProfitabilityResponse> => {
  const res = await fetch(`http://localhost:8000/stock/profitability?query=${query}`);
  if (!res.ok) throw new Error('수익성 비율 조회 실패');
  return res.json();
};

export interface VolatilityResponse {
  symbol: string;
  volatility_score: number;
  raw_data: {
    prdy_ctrt: string;
    prdy_vrss_vol_rate: string;
    w52_hgpr_vrss_prpr_ctrt: string;
    vol_tnrt: string;
  };
}

export const fetchVolatility = async (query: string): Promise<VolatilityResponse> => {
  const res = await fetch(`http://localhost:8000/stock/volatility?query=${query}`);
  if (!res.ok) throw new Error('변동성 점수 조회 실패');
  return res.json();
};

export interface VolatilityHistoryItem {
  stac_yymm: string;
  prdy_ctrt: string;
  prdy_vrss_vol_rate: string;
  w52_hgpr_vrss_prpr_ctrt: string;
  vol_tnrt: string;
}

export interface VolatilityHistoryResponse {
  symbol: string;
  history: VolatilityHistoryItem[];
}