import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';
import { FinancialResponse } from '../api/stockApi';

interface Props {
  data: FinancialResponse | null;
}

const getColor = (value: number) => {
  if (value <= 100) return '#69B34C';   // 좋음
  if (value <= 200) return '#F9C80E';   // 보통
  return '#FF4E42';                     // 위험
};

const makeGaugeData = (label: string, value: number) => [
  { name: label, value, fill: getColor(value) },
];

export const FinancialGauge: React.FC<Props> = ({ data }) => {
  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios[0];

  // ✅ 유효한 데이터만 필터링
  const items = [
    { label: '부채비율', value: latest.lblt_rate },
    { label: '고정비율', value: latest.bram_depn },
    { label: '유동비율', value: latest.crnt_rate },
    { label: '당좌비율', value: latest.quck_rate },
  ].filter((item) => item.value !== null && item.value !== undefined);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      <h3>📍 주요 비율 시각화 (게이지 차트)</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
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
                data={makeGaugeData(item.label, item.value)}
                startAngle={180}
                endAngle={0}
              >
                {/* @ts-ignore */}
                <PolarAngleAxis
                  type="number"
                  domain={[0, 300]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  clockwise
                  dataKey="value"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              {item.value.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
