export interface StockCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
export interface SymbolInfo {
  회사명: string;
  종목코드: string;
  시장구분: string;
}