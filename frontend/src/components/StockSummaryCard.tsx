import React from 'react';
import { StockSummary } from '../api/stockApi';

interface Props {
  data: StockSummary | null;
}

export const StockSummaryCard: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const {
    price, change, change_rate,
    open, high, low,
    previous_close, volume, trade_amount,
  } = data;

  const isUp = change > 0;
  const color = isUp ? 'red' : change < 0 ? 'blue' : 'black';
  const sign = isUp ? '+' : change < 0 ? '' : '';

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
    .getHours()
    .toString()
    .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'relative', // ✅ 기준점
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f9f9fb',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
        maxWidth: 900,
        fontFamily: 'sans-serif',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        minHeight: 120,
      }}
    >
      {/* 왼쪽 - 현재가 + 등락률 */}
      <div>
        <div style={{ fontSize: 36, fontWeight: 'bold', color: '#111' }}>
          {price.toLocaleString()}
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, color }}>
          {isUp ? '▲' : change < 0 ? '▼' : ''}{' '}
          {Math.abs(change).toLocaleString()} ({sign}
          {Math.abs(change_rate).toFixed(2)}%)
        </div>
      </div>

      {/* 오른쪽 - 표 형식 정보 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, auto)',
          gap: '8px 24px',
          fontSize: 14,
        }}
      >
        <div style={{ color: '#999' }}>전일</div>
        <div>{previous_close.toLocaleString()}</div>

        <div style={{ color: '#999' }}>고가</div>
        <div style={{ color: 'red' }}>{high.toLocaleString()}</div>

        <div style={{ color: '#999' }}>시가</div>
        <div style={{ color: 'red' }}>{open.toLocaleString()}</div>

        <div style={{ color: '#999' }}>저가</div>
        <div style={{ color: 'red' }}>{low.toLocaleString()}</div>

        <div style={{ color: '#999' }}>거래량</div>
        <div>{volume.toLocaleString()}</div>

        <div style={{ color: '#999' }}>거래대금(원)</div>
        <div>
          {(trade_amount / 100000000).toFixed(0)}억{' '}
          {Math.round((trade_amount % 100000000) / 10000)}만
        </div>
      </div>

      {/* ✅ 기준 시각 - 오른쪽 하단 고정 */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 12,
          fontSize: 12,
          color: '#888',
        }}
      >
        {formattedDate} 기준
      </div>
    </div>
  );
};
