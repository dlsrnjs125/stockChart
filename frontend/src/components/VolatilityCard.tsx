import React, { useState } from 'react';

interface Props {
  data: {
    prdy_ctrt: string;
    prdy_vrss_vol_rate: string;
    w52_hgpr_vrss_prpr_ctrt: string;
    vol_tnrt: string;
  };
}

const metricDescriptions: Record<string, string> = {
  등락률: '전일 대비 주가 등락률로, 하루 동안의 가격 변동성을 나타냅니다.\n\n📌 뉴스, 이벤트 등 단기 이슈 판단에 유용합니다.',
  거래량변동률: '전일 대비 거래량의 변동 비율로, 거래 활성도 변화의 지표입니다.\n\n📌 급증 시 단기 관심도 및 세력 유입 가능성 분석.',
  괴리율: '52주 고가 대비 현재가의 괴리율로, 고점 대비 얼마나 하락했는지를 보여줍니다.\n\n📌 저평가 또는 시장 외면 종목 판단에 유용.',
  회전율: '유통 주식 수 대비 거래량의 비율로, 해당 종목의 단기 투자 활발도를 나타냅니다.\n\n📌 유동성과 단기 매매 활발도 판단.',
};

const statusColor = {
  높음: '#d62728',
  보통: '#f9c80e',
  낮음: '#2ca02c',
};

const getStatus = (label: string, value: number): string => {
  if (label === '등락률') {
    return Math.abs(value) >= 5 ? '높음' : Math.abs(value) >= 2 ? '보통' : '낮음';
  }
  if (label === '거래량변동률') {
    return value >= 300 ? '높음' : value >= 100 ? '보통' : '낮음';
  }
  if (label === '괴리율') {
    return Math.abs(value) >= 30 ? '높음' : Math.abs(value) >= 15 ? '보통' : '낮음';
  }
  if (label === '회전율') {
    return value >= 20 ? '높음' : value >= 10 ? '보통' : '낮음';
  }
  return '낮음';
};

export const VolatilityCard: React.FC<Props> = ({ data }) => {
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);

  const format = (v: string): string => {
    const n = parseFloat(v);
    return isNaN(n) ? '정보 없음' : `${n.toFixed(2)}%`;
  };

  const items = [
    { label: '등락률', value: parseFloat(data.prdy_ctrt) },
    { label: '거래량변동률', value: parseFloat(data.prdy_vrss_vol_rate) },
    { label: '괴리율', value: parseFloat(data.w52_hgpr_vrss_prpr_ctrt) },
    { label: '회전율', value: parseFloat(data.vol_tnrt) },
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
      <h3 style={{ marginBottom: 16 }}>📋 변동성 구성 지표</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
        }}
      >
        {items.map((item, idx) => {
          const status = getStatus(item.label, item.value);
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
              <div>{isNaN(item.value) ? '정보 없음' : `${item.value.toFixed(2)}%`}</div>
              <div style={{ color: statusColor[status], marginTop: 4 }}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
