import { useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import { createChart, IChartApi, UTCTimestamp } from 'lightweight-charts';
import axios from 'axios';

interface CandlestickChartProps {
  symbol: string;
  range: '24h' | '7d' | 'all';
  assetType: string;
}

export default function CandlestickChart({ symbol, range, assetType }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    // lightweight-charts v4+ uses createChart and returns an IChartApi
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: { background: 'white' as any, textColor: '#222' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    // Use v4+ API. TypeScript may not know about addCandlestickSeries, so cast as any if needed.
    if (chartRef.current && typeof (chartRef.current as any).addCandlestickSeries === 'function') {
      seriesRef.current = (chartRef.current as any).addCandlestickSeries();
    } else {
      seriesRef.current = null;
    }
    return () => { chartRef.current?.remove(); };
  }, [symbol, range]);
