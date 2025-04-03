import React from 'react';
import { FinancialResponse } from '../api/stockApi';

interface Props {
  data: FinancialResponse | null;
}

const statusColor = {
  좋음: '#2ca02c',
  보통: '#ff9800',
  위험: '#d62728',
  '정보 없음': '#999'
};

export const FinancialCard: React.FC<Props> = ({ data }) => {
  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios[0]; // 최신 분기

  const itemStyle = {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    fontSize: 14
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
          gap: 16
        }}
      >
        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>부채비율</div>
          <div>{latest.lblt_rate.toFixed(2)}%</div>
          <div style={{ color: statusColor[latest.lblt_status] }}>{latest.lblt_status}</div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>고정비율</div>
          <div>{latest.bram_depn.toFixed(2)}%</div>
          <div style={{ color: statusColor[latest.bram_status] }}>{latest.bram_status}</div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>유동비율</div>
          <div>{latest.crnt_rate.toFixed(2)}%</div>
          <div style={{ color: statusColor[latest.crnt_status] }}>{latest.crnt_status}</div>
        </div>

        <div style={itemStyle}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>당좌비율</div>
          <div>{latest.quck_rate.toFixed(2)}%</div>
          <div style={{ color: statusColor[latest.quck_status] }}>{latest.quck_status}</div>
        </div>
      </div>
    </div>
  );
};
