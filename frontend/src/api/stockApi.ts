import axios from 'axios';
import { StockCandle } from '../types/stock';

// ✅ 종목 요약 정보
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
  const { data } = await axios.get(`http://localhost:8000/stock/summary?query=${query}`);
  return data;
};

// ✅ 재무 안정성 비율
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

// ✅ 캔들 차트 데이터
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

// ✅ 수익성 비율
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

// ✅ 변동성 점수
export interface VolatilityMetric {
  label: string;
  value: number;
}

export interface VolatilityResponse {
  symbol: string;
  volatility_score: number;
  raw_data: {
    prdy_ctrt: string;
    prdy_vrss_vol_rate: string;
    w52_hgpr_vrss_prpr_ctrt: string;
    vol_tnrt: string;
  };
  score_details: VolatilityMetric[]; // ✅ 각 지표별 점수 추가됨
}

export const fetchVolatility = async (query: string): Promise<VolatilityResponse> => {
  const res = await fetch(`http://localhost:8000/stock/volatility?query=${query}`);
  if (!res.ok) throw new Error('변동성 점수 조회 실패');
  return res.json();
};

// ✅ 수급 리스크 점수 (Radar 차트)
export interface SupplyMetric {
  label: string;
  score: number;
  max: number;
}

export interface SupplyRiskResponse {
  symbol: string;
  risk_score: number;
  risk_level: string;
  score_details: SupplyMetric[];
}

export const fetchSupplyRisk = async (query: string): Promise<SupplyRiskResponse> => {
  const res = await fetch(`http://localhost:8000/stock/supply-risk?query=${query}`);
  if (!res.ok) throw new Error('수급 리스크 점수 조회 실패');
  return res.json();
};
