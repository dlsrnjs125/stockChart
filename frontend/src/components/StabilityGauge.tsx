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

export const StabilityGauge: React.FC<Props> = ({ score }) => {
  const color =
    score >= 90 ? '#2ca02c' : score >= 60 ? '#f9c80e' : '#d62728';

  const getRiskLevel = (score: number): '안정' | '보통' | '위험' => {
    if (score >= 90) return '안정';
    if (score >= 60) return '보통';
    return '위험';
  };
  const riskLevel = getRiskLevel(score);

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

  const explanation = `📌 안정성 점수란?\n
부채비율, 고정비율, 유동비율, 당좌비율 각각을 30점 만점으로 평가하여 계산한 총점입니다.
최대 120점이며, 점수가 높을수록 재무 안정성이 뛰어납니다.

- 90점 이상 : 안정
- 60~89점 : 보통
- 60점 미만 : 위험`;

  return (
    <div style={{ marginBottom: 24, maxWidth: 300, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>📋 안정성 점수</h3>
        <span
          style={{ marginLeft: 6, cursor: 'pointer', fontWeight: 'bold', color: '#888' }}
          title="안정성 점수 설명"
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
          data={[{ name: 'stability', value: score, fill: color }]}
        >
          {/* @ts-ignore */}
          <PolarAngleAxis type="number" domain={[0, 120]} tick={false} angleAxisId={0} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* ✅ 점수 + 위험 수준 출력 */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color }}>{score}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color }}>{riskLevel}</div>
      </div>
    </div>
  );
};
