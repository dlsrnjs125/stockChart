import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { ProfitabilityResponse } from '../api/stockApi';

interface Metric {
  label: string;
  value: number | null;
  score: number;
}

interface Props {
  data: ProfitabilityResponse | null;
}

const getStatus = (score: number): '우수' | '양호' | '보통' | '위험' => {
  if (score >= 25) return '우수';
  if (score >= 15) return '양호';
  if (score >= 5) return '보통';
  return '위험';
};

const statusColor: Record<'우수' | '양호' | '보통' | '위험', string> = {
  우수: '#2ca02c',
  양호: '#4caf50',
  보통: '#f9c80e',
  위험: '#d62728',
};

const descriptions: Record<string, string> = {
  ROE: '📌 ROE (자기자본이익률)\n\n자기자본을 얼마나 효율적으로 활용해 이익을 냈는지를 나타냅니다.',
  ROA: '📌 ROA (총자산이익률)\n\n총자산 대비 이익률로, 기업 전체 자산의 효율성을 보여줍니다.',
  영업이익률: '📌 영업이익률\n\n매출에서 영업이익이 차지하는 비율로, 핵심 사업의 수익성을 나타냅니다.',
  순이익률: '📌 순이익률\n\n매출 대비 최종 이익 비율로, 기업 전체의 수익성 수준을 반영합니다.',
};

export const ProfitabilityOverview: React.FC<Props> = ({ data }) => {
  const [tooltipKey, setTooltipKey] = useState<string | null>(null);

  if (!data || !data.score_details || data.score_details.length === 0) return null;

  const metrics: Metric[] = data.score_details.map((item) => ({
    label: item.label,
    value: typeof item.value === 'number' ? item.value : null,
    score: item.score,
  }));

  return (
    <div
      style={{
        background: '#f6f9fb',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        maxWidth: 1000,
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>📋 수익성 구성 지표</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {metrics.map((item, idx) => {
          const status = getStatus(item.score);
          const color = statusColor[status];

          return (
            <div
              key={idx}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                position: 'relative',
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
                  data={[
                    {
                      name: item.label,
                      value: item.score,
                      fill: color,
                    },
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  {/* @ts-ignore */}
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 30]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar background dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>

              <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14 }}>
                {item.value !== null ? `${item.value.toFixed(2)}%` : '정보 없음'} /{' '}
                <span style={{ color }}>{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
