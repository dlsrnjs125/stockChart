import React from 'react';
import { ProfitabilityResponse } from '../api/stockApi';

interface Props {
  data: ProfitabilityResponse | null;
}

const getStatus = (key: string, value: number): string => {
  if (key === 'roe') {
    if (value >= 10) return '우수';
    if (value >= 7) return '양호';
    if (value >= 3) return '보통';
    return '위험';
  }
  if (key === 'roa') {
    if (value >= 5) return '우수';
    if (value >= 3) return '양호';
    if (value >= 1) return '보통';
    return '위험';
  }
  if (key === 'net_margin') {
    if (value >= 10) return '매우 양호';
    if (value >= 7) return '양호';
    if (value >= 3) return '보통';
    return '위험';
  }
  if (key === 'operating_margin') {
    if (value >= 30) return '우수';
    if (value >= 20) return '양호';
    if (value >= 10) return '보통';
    return '위험';
  }
  return '정보 없음';
};

const statusColor = {
  우수: '#2ca02c',
  '매우 양호': '#2ca02c',
  양호: '#4caf50',
  보통: '#ff9800',
  위험: '#d62728',
  '정보 없음': '#999'
};

export const ProfitabilityCard: React.FC<Props> = ({ data }) => {
  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios.find(
    (r) => r.roe !== null || r.operating_margin !== null || r.net_margin !== null
  );
  if (!latest) return null;

  const metrics = [
    { label: 'ROE', key: 'roe', value: latest.roe },
    { label: 'ROA', key: 'roa', value: latest.roa },
    { label: '영업이익률', key: 'operating_margin', value: latest.operating_margin },
    { label: '순이익률', key: 'net_margin', value: latest.net_margin }
  ];

  return (
    <div
      style={{
        background: '#f6f9fb',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        maxWidth: 900,
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>{latest.stac_yymm} 기준 수익성 비율</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16
        }}
      >
        {metrics.map((item, idx) => {
          const status =
            item.value !== null && item.value !== undefined
              ? getStatus(item.key, item.value)
              : '정보 없음';

          return (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                fontSize: 14
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{item.label}</div>
              <div>{item.value !== null && item.value !== undefined ? `${item.value.toFixed(2)}%` : '정보 없음'}</div>
              <div style={{ color: statusColor[status], marginTop: 4 }}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
