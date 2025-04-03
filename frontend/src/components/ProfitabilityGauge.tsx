import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ProfitabilityResponse } from '../api/stockApi';

interface Props {
  data: ProfitabilityResponse | null;
}

const getColor = (value: number | null) => {
  if (value === null) return '#ccc';
  if (value >= 20) return '#69B34C'; // 좋음
  if (value >= 10) return '#F9C80E'; // 보통
  return '#FF4E42'; // 낮음
};

export const ProfitabilityGauge: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const latest = data.ratios.find(r => r.roe !== null || r.operating_margin !== null || r.net_margin !== null);
  if (!latest) return null;

  const items = [
    { label: 'ROE', value: latest.roe },
    { label: 'ROA', value: latest.roa },
    { label: '영업이익률', value: latest.operating_margin },
    { label: '순이익률', value: latest.net_margin },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <h3>📍 수익성 게이지 차트</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        maxWidth: 900,
      }}>
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>{item.label}</div>
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="60%" outerRadius="100%"
                barSize={15}
                data={[{ name: item.label, value: item.value ?? 0, fill: getColor(item.value) }]}
                startAngle={180}
                endAngle={0}
              >
                {/* @ts-ignore */}
                <PolarAngleAxis type="number" domain={[0, 50]} angleAxisId={0} tick={false} />
                <RadialBar background clockwise dataKey="value" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              {item.value !== null ? `${item.value.toFixed(2)}%` : '정보 없음'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
