import { useEffect, useState } from 'react';
import axios from 'axios';
import AssetChart from './AssetChart';
import CandlestickChart from './CandlestickChart';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs } from './ui/tabs';
import { useMemo, useRef } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { CoinModal } from './CoinModal';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from './ui/table';
import { FixedSizeList as List } from 'react-window';

type Asset = {
  symbol: string;
  name: string;
  assetType: string;
};

const assets = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', assetType: 'crypto' },
  { symbol: 'ETHUSDT', name: 'Ethereum', assetType: 'crypto' },
  { symbol: 'AAPL', name: 'Apple', assetType: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', assetType: 'stock' },
  { symbol: 'EURUSD', name: 'EUR/USD', assetType: 'forex' },
];

function assetTypeIcon(type: string) {
  if (type === 'crypto') return '🪙';
  if (type === 'stock') return '📈';
  if (type === 'forex') return '💱';
  return '';
}

const ranges = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: 'All', value: 'all' },
];

type Ticker24hr = {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
};

type SortKey = 'symbol' | 'price' | 'change';

export default function AssetDashboard() {
  const [search, setSearch] = useState('');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [assets, setAssets] = useState<Asset[]>([]);
