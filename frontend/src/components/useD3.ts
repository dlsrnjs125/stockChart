import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void, deps: any[]) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove(); // reset
      renderChartFn(svg);
    }
  }, deps);

  return ref;
};
