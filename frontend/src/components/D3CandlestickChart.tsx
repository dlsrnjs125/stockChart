import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3';
import { StockCandle } from '../types/stock';

interface Props {
  data: StockCandle[];
  symbol: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export const D3CandlestickChart: React.FC<Props> = ({ data, symbol, timeframe }) => {
  const ref = useD3((svg) => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 50, bottom: 80, left: 60 };
    const width = 900;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const volumeHeight = 100;

    // 날짜 파싱
    const parseDate = d3.timeParse('%Y%m%d');
    const candles = data.map((d) => ({
      ...d,
      date: parseDate(d.time)!,
    }));
    const svgArea = svg
      .attr('width', width)
      .attr('height', height)
      .selectAll('g.chart-area')
      .data([null])
      .join('g')
      .attr('class', 'chart-area')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svgArea.selectAll('*').remove(); // 내부만 초기화

    const x = d3
      .scaleBand()
      .domain(candles.map((d) => d.date.toString()))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([d3.min(candles, (d) => d.low)! * 0.98, d3.max(candles, (d) => d.high)! * 1.02])
      .range([innerHeight - volumeHeight, 0]);

    const yVolume = d3
      .scaleLinear()
      .domain([0, d3.max(candles, (d) => d.volume)! * 1.2])
      .range([innerHeight, innerHeight - volumeHeight]);

    const xAxis = d3.axisBottom(x).tickFormat((d: any) => {
      const date = new Date(d);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    svgArea
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    svgArea.append('g').call(d3.axisLeft(y));
    // 이동평균선 (5일)
    const sma = candles.map((d, i, arr) => {
      if (i < 4) return null;
      const avg = d3.mean(arr.slice(i - 4, i + 1), (d) => d.close)!;
      return { date: d.date, value: avg };
    }).filter(Boolean) as { date: Date; value: number }[];

    const line = d3.line<{ date: Date; value: number }>()
      .x((d) => x(d.date.toString())! + x.bandwidth() / 2)
      .y((d) => y(d.value));

    svgArea.append('path')
      .datum(sma)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2)
      .attr('d', line);

    // 캔들 + 거래량
    candles.forEach((d) => {
      const xVal = x(d.date.toString())!;
      const bw = x.bandwidth();
      const color = d.close > d.open ? '#d62728' : '#2ca02c'; // 상승: 빨강, 하락: 초록

      // 꼬리
      svgArea.append('line')
        .attr('x1', xVal + bw / 2)
        .attr('x2', xVal + bw / 2)
        .attr('y1', y(d.high))
        .attr('y2', y(d.low))
        .attr('stroke', color);

      // 몸통
      svgArea.append('rect')
        .attr('x', xVal)
        .attr('y', y(Math.max(d.open, d.close)))
        .attr('width', bw)
        .attr('height', Math.max(1, Math.abs(y(d.open) - y(d.close))))
        .attr('fill', color);

      // 거래량 바
      svgArea.append('rect')
        .attr('x', xVal)
        .attr('y', yVolume(d.volume))
        .attr('width', bw)
        .attr('height', innerHeight - yVolume(d.volume))
        .attr('fill', color)
        .attr('opacity', 0.4);

      // 거래량 텍스트
      svgArea.append('text')
        .attr('x', xVal + bw / 2)
        .attr('y', yVolume(d.volume) - 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#666')
        .text(`${(d.volume / 1_000_000).toFixed(0)}M`);
    });
    const tooltip = svg
      .append('text')
      .attr('x', 10)
      .attr('y', 15)
      .attr('fill', 'black')
      .attr('font-size', 12);

    svg.on('mousemove', function (event) {
      const [mx] = d3.pointer(event);
      const index = Math.floor((mx - margin.left) / x.bandwidth());
      const d = candles[index];
      if (!d) return;

      tooltip.text(
        `📅 ${d3.timeFormat('%Y-%m-%d')(d.date)} | 시: ${d.open.toLocaleString()} 고: ${d.high.toLocaleString()} 저: ${d.low.toLocaleString()} 종: ${d.close.toLocaleString()} 거래량: ${(d.volume / 1_000_000).toFixed(1)}M`
      );
    });

    // Zoom 기능 (축소 확대)
    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', (event) => {
          svgArea.attr('transform', `translate(${margin.left + event.transform.x},${margin.top}) scale(${event.transform.k}, 1)`);
        })
    );
  }, [data]);

  return <svg ref={ref}></svg>;
};
