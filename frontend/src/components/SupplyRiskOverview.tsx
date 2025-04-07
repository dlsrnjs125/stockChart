import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { SupplyMetric } from '../api/stockApi';

interface Props {
  data: SupplyMetric[]; // value 필드 포함되어 있어야 함
}

// 설명 텍스트
const descriptions: Record<string, string> = {
  '외국인 지분율': `📌 외국인 지분율\n\n외국인이 해당 종목을 얼마나 보유하고 있는지를 나타냅니다.\n40% 이상이면 수급이 안정적인 것으로 평가됩니다.`,
  '외국인 순매수': `📌 외국인 순매수\n\n외국인의 매수/매도 흐름을 나타냅니다.\n매수 우위일수록 긍정적인 신호입니다.`,
  '기관 순매수': `📌 기관 순매수\n\n기관 투자자의 수급 동향을 나타냅니다.\n기관의 지속적인 매수는 상승 기대 요인이 될 수 있습니다.`,
  '회전율(유동성)': `📌 회전율\n\n유통 주식 대비 거래량 비율로 유동성을 나타냅니다.\n0.1~2.0% 범위가 적정 수준입니다.`,
};

// ✅ 수치 기반 상태 판단
const getStatusByValue = (label: string, value: number): '좋음' | '보통' | '위험' => {
  switch (label) {
    case '외국인 지분율':
      if (value >= 40) return '좋음';
      if (value >= 20) return '보통';
      return '위험';

    case '외국인 순매수':
    case '기관 순매수':
      if (value > 1_000_000) return '좋음';
      if (value > 0) return '보통';
      return '위험';

    case '회전율(유동성)':
      if (value >= 0.1 && value <= 2.0) return '좋음';
      if (value <= 5.0) return '보통';
      return '위험';

    default:
      return '보통';
  }
};

const statusColor: Record<'좋음' | '보통' | '위험', string> = {
  좋음: '#2ca02c',
  보통: '#ff9800',
  위험: '#d62728',
};

export const SupplyRiskOverview: React.FC<Props> = ({ data }) => {
  const [tooltipKey, setTooltipKey] = useState<string | null>(null);

  if (!data || data.length === 0) return null;

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
      <h3 style={{ marginBottom: 16 }}>📊 외국인·기관 수급 리스크 지표</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {data.map((item, i) => {
          const status = getStatusByValue(item.label, item.value);
          const color = statusColor[status];

          return (
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
              {/* 제목 + 툴팁 */}
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
                  title="설명 보기"
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

              {/* 도넛 차트 */}
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
                    domain={[0, item.max || 30]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar background dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* 수치 + 상태 출력 */}
              <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14 }}>
                {typeof item.value === 'number'
                  ? `${item.value.toLocaleString()}`
                  : '정보 없음'}{' '}
                / <span style={{ color }}>{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
