import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import axios from 'axios';

interface AssetChartProps {
  symbol: string;
  assetType: string;
  range: '24h' | '7d' | 'all';
}

// Helper to color-code up/down segments
function getLineSegments(data: any[]) {
  if (!data.length) return [];
  const segments = [];
  for (let i = 1; i < data.length; i++) {
    segments.push({
      from: data[i - 1],
      to: data[i],
      isUp: data[i].price > data[i - 1].price
