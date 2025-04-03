import axios from 'axios';
import { StockCandle } from '../types/stock';

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
