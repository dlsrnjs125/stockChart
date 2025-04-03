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

    svgArea.selectAll('*').remove();

    const x = d3
      .scaleBand()
      .domain(candles.map((d) => d.date.toISOString()))
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

    // ✅ Y축 격자선
    svgArea.append('g')
      .attr('class', 'grid y-grid')
      .call(
        d3.axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // ✅ X축 격자선
    svgArea.append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', `translate(0, ${innerHeight - volumeHeight})`)
      .call(
        d3.axisBottom(x)
          .tickSize(-innerHeight + volumeHeight)
          .tickFormat(() => '')
      );

    // ✅ 실제 축
    svgArea
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => {
        const date = new Date(d);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }));

    svgArea.append('g').call(d3.axisLeft(y));

    const sma = candles.map((d, i, arr) => {
      if (i < 4) return null;
      const avg = d3.mean(arr.slice(i - 4, i + 1), (d) => d.close)!;
      return { date: d.date, value: avg };
    }).filter(Boolean) as { date: Date; value: number }[];

    const line = d3.line<{ date: Date; value: number }>()
      .x((d) => x(d.date.toISOString())! + x.bandwidth() / 2)
      .y((d) => y(d.value));

    svgArea.append('path')
      .datum(sma)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2)
      .attr('d', line);

    const barGroup = svgArea.append('g').attr('class', 'candles');
    candles.forEach((d) => {
      const xVal = x(d.date.toISOString())!;
      const bw = x.bandwidth();
      const color = d.close > d.open ? '#d62728' : '#2ca02c';

      barGroup.append('line')
        .attr('x1', xVal + bw / 2)
        .attr('x2', xVal + bw / 2)
        .attr('y1', y(d.high))
        .attr('y2', y(d.low))
        .attr('stroke', color);

      barGroup.append('rect')
        .attr('x', xVal)
        .attr('y', y(Math.max(d.open, d.close)))
        .attr('width', bw)
        .attr('height', Math.max(1, Math.abs(y(d.open) - y(d.close))))
        .attr('fill', color);

      barGroup.append('rect')
        .attr('x', xVal)
        .attr('y', yVolume(d.volume))
        .attr('width', bw)
        .attr('height', innerHeight - yVolume(d.volume))
        .attr('fill', color)
        .attr('opacity', 0.4);
    });

    const crosshairV = svg.append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '3,3')
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .style('display', 'none');

    const crosshairH = svg.append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '3,3')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .style('display', 'none');

    const tooltipGroup = svg.append('g').style('display', 'none');
    const tooltipBox = tooltipGroup.append('rect')
      .attr('width', 160)
      .attr('height', 100)
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', 'white')
      .attr('stroke', '#ccc')
      .attr('opacity', 0.95);

    const tooltipLines = Array.from({ length: 6 }).map((_, i) =>
      tooltipGroup.append('text')
        .attr('x', 12)
        .attr('y', 20 + i * 15)
        .attr('font-size', i === 0 ? 13 : 12)
        .attr('font-weight', i === 0 ? 'bold' : 'normal')
        .attr('fill', '#333')
    );

    const staticText = svg.append('text')
      .attr('x', 10)
      .attr('y', 15)
      .attr('font-size', 12)
      .attr('fill', 'black');

    svg.on('mousemove', function (event) {
      const [mx, my] = d3.pointer(event);
      const dateToX = new Map(candles.map((d) => [d.date.toISOString(), x(d.date.toISOString())!]));
      const closest = d3.least(candles, (d) =>
        Math.abs((dateToX.get(d.date.toISOString()) ?? 0) + x.bandwidth() / 2 - (mx - margin.left))
      );

      if (!closest) return;

      const dx = dateToX.get(closest.date.toISOString())!;
      const xPos = dx + x.bandwidth() / 2 + margin.left;

      const tooltipWidth = 160;
      const tooltipOffset = 10;
      const showLeft = xPos + tooltipWidth + tooltipOffset > width;
      const tooltipX = showLeft ? xPos - tooltipWidth - tooltipOffset : xPos + tooltipOffset;

      tooltipGroup
        .style('display', null)
        .attr('transform', `translate(${tooltipX},${my - 60})`);

      tooltipLines[0].text(`📅 ${d3.timeFormat('%Y-%m-%d')(closest.date)}`);
      tooltipLines[1].text(`시: ${closest.open.toLocaleString()}`);
      tooltipLines[2].text(`고: ${closest.high.toLocaleString()}`);
      tooltipLines[3].text(`저: ${closest.low.toLocaleString()}`);
      tooltipLines[4].text(`종: ${closest.close.toLocaleString()}`);
      tooltipLines[5].text(`거래량: ${(closest.volume / 1_000_000).toFixed(1)}M`);

      staticText.text(
        `📅 ${d3.timeFormat('%Y-%m-%d')(closest.date)} | 시: ${closest.open.toLocaleString()} 고: ${closest.high.toLocaleString()} 저: ${closest.low.toLocaleString()} 종: ${closest.close.toLocaleString()} 거래량: ${(closest.volume / 1_000_000).toFixed(1)}M`
      );

      crosshairV.attr('x1', xPos).attr('x2', xPos).style('display', null);
      crosshairH.attr('y1', my).attr('y2', my).style('display', null);
    });

    svg.on('mouseleave', () => {
      tooltipGroup.style('display', 'none');
      crosshairV.style('display', 'none');
      crosshairH.style('display', 'none');
      staticText.text('');
    });

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [width, height]])
        .on('zoom', (event) => {
          svgArea.attr('transform', `translate(${margin.left + event.transform.x},${margin.top}) scale(${event.transform.k}, 1)`);
        })
    );
  }, [data]);

  return (
    <>
      <style>
        {`
          .grid line {
            stroke: #aaa;
            stroke-opacity: 0.2;
            shape-rendering: crispEdges;
          }
          .grid path {
            display: none;
          }
        `}
      </style>
      <svg ref={ref}></svg>
    </>
  );
};
