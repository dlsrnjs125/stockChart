import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
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

const descriptions: Record<string, string> = {
  부채비율:
    '총자산 대비 총부채의 비율로, 기업의 재무 건전성을 나타냅니다. 일반적으로 200% 이하가 바람직합니다.',
  고정비율:
    '자기자본 대비 고정자산의 비율로, 장기적인 안정성을 보여줍니다. 낮을수록 유동성 확보에 유리합니다.',
  유동비율:
    '유동자산 대비 유동부채의 비율로, 단기 지급능력을 나타냅니다. 일반적으로 100% 이상이 이상적입니다.',
  당좌비율:
    '유동비율 중 재고자산을 제외한 당좌자산 대비 유동부채 비율입니다. 보다 보수적인 단기 지급능력 지표입니다.',
};

const getColor = (value: number | null) => {
  if (value === null) return '#ccc';
  if (value <= 100) return '#69B34C';
  if (value <= 200) return '#F9C80E';
  return '#FF4E42';
};

export const FinancialOverview: React.FC<Props> = ({ data }) => {
  const [tooltipKey, setTooltipKey] = useState<string | null>(null);

  if (!data || data.ratios.length === 0) return null;
  const latest = data.ratios[0];

  const metrics = [
    {
      label: '부채비율',
      value: latest.lblt_rate,
      status: latest.lblt_status,
    },
    {
      label: '고정비율',
      value: latest.bram_depn,
      status: latest.bram_status,
    },
    {
      label: '유동비율',
      value: latest.crnt_rate,
      status: latest.crnt_status,
    },
    {
      label: '당좌비율',
      value: latest.quck_rate,
      status: latest.quck_status,
    },
  ];

  return (
    <div
      style={{
        marginBottom: 24,
        maxWidth: 1000,
        padding: 20,
        borderRadius: 12,
        background: '#f6f9fb',
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>📋 안정성 구성 지표</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {metrics.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              padding: '12px 16px',
              borderRadius: 8,
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {item.label}
              <span
                style={{
                  marginLeft: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#888',
                }}
                onClick={() =>
                  setTooltipKey(tooltipKey === item.label ? null : item.label)
                }
              >
                ℹ️
              </span>
              {tooltipKey === item.label && (
                <div
                  style={{
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    zIndex: 10,
                    background: '#333',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    maxWidth: 260,
                    whiteSpace: 'pre-line',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  {descriptions[item.label]}
                </div>
              )}
            </div>

            <ResponsiveContainer width="100%" height={130}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="100%"
                barSize={12}
                data={[{
                  name: item.label,
                  value: item.value,
                  fill: getColor(item.value),
                }]}
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
                <RadialBar background dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>

            <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14 }}>
              {item.value?.toFixed(2)}% /{' '}
              <span style={{ color: statusColor[item.status ?? '정보 없음'] }}>
                {item.status ?? '정보 없음'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};