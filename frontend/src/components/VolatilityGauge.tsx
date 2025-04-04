import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  score: number;
}

export const VolatilityGauge: React.FC<Props> = ({ score }) => {
  const color = score >= 70 ? '#FF4E42' : score >= 40 ? '#F9C80E' : '#69B34C';
  const [showTooltip, setShowTooltip] = useState(false);

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

  const explanation = `📌 변동성 점수란?\n
전일 등락률, 거래량 변동률, 괴리율, 회전율을 조합하여 계산된 수치입니다.
0~100점 사이이며, 점수가 높을수록 단기 리스크가 큽니다.

- 0~39 : 낮음 (안정적)
- 40~69 : 보통 (주의)
- 70~100 : 높음 (위험)`;

  return (
    <div style={{ marginBottom: 24, maxWidth: 300, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>⚡ 변동성 점수</h3>
        <span
          style={{ marginLeft: 6, cursor: 'pointer', fontWeight: 'bold', color: '#888' }}
          title="변동성 점수 설명"
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
          data={[{ name: 'volatility', value: score, fill: color }]}
        >
          {/* @ts-ignore */}
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>

      <div
        style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 18,
          fontWeight: 600,
          color,
        }}
      >
        {score}
      </div>
    </div>
  );
};
