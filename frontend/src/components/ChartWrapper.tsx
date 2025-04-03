import React, { useEffect, useState } from 'react';
import {
  fetchCandles,
  fetchStockSummary,
  fetchFinancialRatios,
  StockSummary,
  FinancialResponse
} from '../api/stockApi';
import { StockCandle } from '../types/stock';
import { D3CandlestickChart } from './D3CandlestickChart';
import { StockSummaryCard } from './StockSummaryCard';
import { FinancialCard } from './FinancialCardText'; // ✅ 추가
import { FinancialChart } from './FinancialChart';
import { FinancialGauge } from './FinancialGauge';

interface StockInfo {
  회사명: string;
  종목코드: string;
  시장구분: string;
}

export const ChartWrapper: React.FC = () => {
  const [data, setData] = useState<StockCandle[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [symbol, setSymbol] = useState('005930');
  const [inputValue, setInputValue] = useState('');
  const [stockList, setStockList] = useState<StockInfo[]>([]);
  const [suggestions, setSuggestions] = useState<StockInfo[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [financial, setFinancial] = useState<FinancialResponse | null>(null); // ✅ 추가

  useEffect(() => {
    fetch('http://localhost:8000/stocks')
      .then((res) => res.json())
      .then((json: StockInfo[]) => setStockList(json))
      .catch((err) => console.error('종목 리스트 불러오기 실패:', err));
  }, []);

  useEffect(() => {
    if (symbol) {
      fetchCandles(symbol, timeframe).then(setData);
      fetchStockSummary(symbol).then(setSummary).catch(() => setSummary(null));
      fetchFinancialRatios(symbol).then(setFinancial).catch(() => setFinancial(null)); // ✅ 추가
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = inputValue.toLowerCase();
    const filtered = stockList
      .filter((s) =>
        s.회사명.toLowerCase().includes(lower) || s.종목코드.includes(lower)
      )
      .slice(0, 5);

    setSuggestions(filtered);
  }, [inputValue, stockList]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      const match = stockList.find(
        (s) =>
          s.회사명 === inputValue.trim() || s.종목코드 === inputValue.trim()
      );
      if (match) {
        setSymbol(match.종목코드);
      } else {
        setSymbol(inputValue.trim());
      }
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (종목코드: string) => {
    setSymbol(종목코드);
    setInputValue('');
    setSuggestions([]);
  };

  const selectedStock = stockList.find((s) => s.종목코드 === symbol);
  const displayTitle = selectedStock
    ? `${selectedStock.회사명} (${selectedStock.종목코드})`
    : symbol;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{displayTitle} 차트</h2>

      <StockSummaryCard data={summary} />

      {/* ✅ 재무비율 카드 */}
      <FinancialCard data={financial} />
      {/* ✅ 시각화 형태 1: 게이지 차트 */}
      <FinancialGauge data={financial} />
      {/* ✅ 시각화 형태 2: 분기별 추이 막대 그래프 */}
      <FinancialChart data={financial} />

      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <label style={{ marginRight: '10px' }}>
          종목 검색:
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="예: 대한항공 또는 003490"
            style={{ marginLeft: 10 }}
          />
        </label>
        <button onClick={handleSearch}>검색</button>

        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: 35,
              left: 0,
              background: 'white',
              border: '1px solid #ccc',
              width: 300,
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 10,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(s.종목코드)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {s.회사명} ({s.종목코드}) [{s.시장구분}]
              </li>
            ))}
          </ul>
        )}

        <label style={{ marginLeft: 20 }}>
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
