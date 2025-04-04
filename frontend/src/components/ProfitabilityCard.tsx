import React, { useState } from 'react';
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
  '정보 없음': '#999',
};

const metricDescriptions: Record<string, string> = {
  ROE: '자기자본이익률로, 자기자본을 얼마나 효율적으로 활용해 이익을 냈는지를 나타냅니다.',
  ROA: '총자산이익률로, 총자산 대비 얼마나 이익을 냈는지를 보여주는 수익성 지표입니다.',
  영업이익률: '매출액 대비 영업이익의 비율로, 영업활동의 수익성을 나타냅니다.',
  순이익률: '매출액 대비 최종 순이익의 비율로, 기업의 최종적인 수익성을 보여줍니다.',
};

export const ProfitabilityCard: React.FC<Props> = ({ data }) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);

  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios.find(
    (r) => r.roe !== null || r.operating_margin !== null || r.net_margin !== null
  );
  if (!latest) return null;

  const metrics = [
    { label: 'ROE', key: 'roe', value: latest.roe },
    { label: 'ROA', key: 'roa', value: latest.roa },
    { label: '영업이익률', key: 'operating_margin', value: latest.operating_margin },
    { label: '순이익률', key: 'net_margin', value: latest.net_margin },
  ];

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 10,
    background: '#333',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 6,
    fontSize: 12,
    maxWidth: 240,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  };

  const infoIconStyle: React.CSSProperties = {
    marginLeft: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#888',
  };

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
          gap: 16,
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
                fontSize: 14,
                position: 'relative',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                {item.label}
                <span
                  style={infoIconStyle}
                  onClick={() =>
                    setVisibleTooltip(visibleTooltip === item.label ? null : item.label)
                  }
                  title="설명 보기"
                >
                  ℹ️
                </span>
                {visibleTooltip === item.label && (
                  <div style={tooltipStyle}>{metricDescriptions[item.label]}</div>
                )}
              </div>
              <div>
                {item.value !== null && item.value !== undefined
                  ? `${item.value.toFixed(2)}%`
                  : '정보 없음'}
              </div>
              <div style={{ color: statusColor[status], marginTop: 4 }}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
