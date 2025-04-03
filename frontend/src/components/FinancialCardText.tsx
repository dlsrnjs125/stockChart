import React from 'react';
import { FinancialResponse } from '../api/stockApi';

interface Props {
  data: FinancialResponse | null;
}

const statusColor: Record<string, string> = {
  좋음: '#2ca02c',
  보통: '#ff9800',
  위험: '#d62728',
  '정보 없음': '#999',
};

export const FinancialCard: React.FC<Props> = ({ data }) => {
  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios[0]; // 최신 분기

  const format = (val: number | null | undefined): string =>
    val !== null && val !== undefined ? `${val.toFixed(2)}%` : '정보 없음';

  const getStatusColor = (status: string | null | undefined): string =>
    statusColor[status ?? '정보 없음'] ?? statusColor['정보 없음'];

  const itemStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    fontSize: 14,
  };

  return (
    <div
      style={{
        marginBottom: 24,
        maxWidth: 900,
        padding: 20,
        borderRadius: 12,
        background: '#f6f9fb',
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>{latest.stac_yymm} 기준 재무비율</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>부채비율</div>
          <div>{format(latest.lblt_rate)}</div>
          <div style={{ color: getStatusColor(latest.lblt_status) }}>
            {latest.lblt_status ?? '정보 없음'}
          </div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>고정비율</div>
          <div>{format(latest.bram_depn)}</div>
          <div style={{ color: getStatusColor(latest.bram_status) }}>
            {latest.bram_status ?? '정보 없음'}
          </div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>유동비율</div>
          <div>{format(latest.crnt_rate)}</div>
          <div style={{ color: getStatusColor(latest.crnt_status) }}>
            {latest.crnt_status ?? '정보 없음'}
          </div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>당좌비율</div>
          <div>{format(latest.quck_rate)}</div>
          <div style={{ color: getStatusColor(latest.quck_status) }}>
            {latest.quck_status ?? '정보 없음'}
          </div>
        </div>
      </div>
    </div>
  );
};
