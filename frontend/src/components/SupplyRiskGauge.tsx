import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  score: number | null;
}

const getStatus = (score: number | null) => {
  if (score === null || isNaN(score)) return { label: '정보 없음', color: '#999' };
  if (score >= 70) return { label: '위험', color: '#FF4E42' };
  if (score >= 40) return { label: '보통', color: '#F9C80E' };
  return { label: '좋음', color: '#69B34C' };
};

export const SupplyRiskGauge: React.FC<Props> = ({ score }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { label, color } = getStatus(score);

  const explanation = `📌 수급 리스크 점수란?

외국인·기관의 순매수/지분율, 회전율(유동성)을 종합 분석한 점수입니다.
점수가 높을수록 수급 불안정 가능성이 큽니다.

- 0~39점: 좋음 (안정적)
- 40~69점: 보통 (주의 필요)
- 70~100점: 위험 (매수 신중 필요)
`;

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: 40,
    left: 10,
    background: '#333',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 12,
    whiteSpace: 'pre-line',
    maxWidth: 320,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 100,
  };

  return (
    <div style={{ marginBottom: 24, maxWidth: 300, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>📊 수급 리스크 점수</h3>
        <span
          style={{
            marginLeft: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#888',
          }}
          title="수급 리스크 설명"
          onClick={() => setShowTooltip(!showTooltip)}
        >
          ℹ️
        </span>
      </div>

      {showTooltip && <div style={tooltipStyle}>{explanation}</div>}

      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="60%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          barSize={20}
          data={[{ name: 'risk', value: score ?? 0, fill: color }]}
        >
          {/* @ts-ignore */}
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color }}>
          {score !== null ? score.toFixed(2) : '–'}
        </div>
        <div style={{ fontSize: 14, marginTop: 4, color }}>{label}</div>
      </div>
    </div>
  );
};
