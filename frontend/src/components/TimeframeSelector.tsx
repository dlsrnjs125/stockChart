import React from 'react';

interface Props {
  value: 'daily' | 'weekly' | 'monthly';
  onChange: (value: 'daily' | 'weekly' | 'monthly') => void;
}

export const TimeframeSelector: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as any)}>
      <option value="daily">일</option>
      <option value="weekly">주</option>
      <option value="monthly">월</option>
    </select>
  );
};
