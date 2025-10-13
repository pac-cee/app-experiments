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
