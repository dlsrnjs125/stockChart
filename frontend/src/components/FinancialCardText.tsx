import React, { useState } from 'react';
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

const ratioDescriptions: Record<string, string> = {
  부채비율:
    '총자산 대비 총부채의 비율로, 기업의 재무 건전성을 나타냅니다. 일반적으로 200% 이하가 바람직합니다.',
  고정비율:
    '자기자본 대비 고정자산의 비율로, 장기적인 안정성을 보여줍니다. 낮을수록 유동성 확보에 유리합니다.',
  유동비율:
    '유동자산 대비 유동부채의 비율로, 단기 지급능력을 나타냅니다. 일반적으로 100% 이상이 이상적입니다.',
  당좌비율:
    '유동비율 중 재고자산을 제외한 당좌자산 대비 유동부채 비율입니다. 보다 보수적인 단기 지급능력 지표입니다.',
};

export const FinancialCard: React.FC<Props> = ({ data }) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);

  if (!data || data.ratios.length === 0) return null;

  const latest = data.ratios[0];

  const format = (val: number | null | undefined): string =>
    val !== null && val !== undefined ? `${val.toFixed(2)}%` : '정보 없음';

  const getStatusColor = (status: string | null | undefined): string =>
    statusColor[status ?? '정보 없음'] ?? statusColor['정보 없음'];

  const itemStyle: React.CSSProperties = {
    position: 'relative',
    padding: '8px 12px',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    fontSize: 14,
  };

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

  const renderCard = (
    label: string,
    value: number | null | undefined,
    status: string | null | undefined
  ) => (
    <div style={itemStyle}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
        {label}
        <span
          style={infoIconStyle}
          onClick={() =>
            setVisibleTooltip(visibleTooltip === label ? null : label)
          }
          title="설명 보기"
        >
          ℹ️
        </span>
        {visibleTooltip === label && (
          <div style={tooltipStyle}>{ratioDescriptions[label]}</div>
        )}
      </div>
      <div>{format(value)}</div>
      <div style={{ color: getStatusColor(status) }}>
        {status ?? '정보 없음'}
      </div>
    </div>
  );

  return (
    <div
      style={{
        marginBottom: 24,
        maxWidth: 900,
        padding: 20,
        borderRadius: 12,
        background: '#f6f9fb',
        fontFamily: 'sans-serif',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>{latest.stac_yymm} 기준 재무비율</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {renderCard('부채비율', latest.lblt_rate, latest.lblt_status)}
        {renderCard('고정비율', latest.bram_depn, latest.bram_status)}
        {renderCard('유동비율', latest.crnt_rate, latest.crnt_status)}
        {renderCard('당좌비율', latest.quck_rate, latest.quck_status)}
      </div>
    </div>
  );
};
