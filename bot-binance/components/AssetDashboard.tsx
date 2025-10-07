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
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [ticker24, setTicker24] = useState<Record<string, Ticker24hr>>({});
  const [selected, setSelected] = useState<Asset | null>(null);
  const [range, setRange] = useState<'24h' | '7d' | 'all'>('24h');
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
      } catch { return []; }
    }
    return [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterQuote, setFilterQuote] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortAsc, setSortAsc] = useState(true);
  const [tab, setTab] = useState<'pairs' | 'coins'>('pairs');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  // For sparklines: map symbol -> price history
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>({});
  // Coin modal state
  const [coinModal, setCoinModal] = useState<null | { coin: string, best: { symbol: string, name: string } }>(null);
  const [coinModalChartType, setCoinModalChartType] = useState<'line' | 'candle'>('line');
  const [coinModalRange, setCoinModalRange] = useState<'24h' | '7d' | 'all'>('24h');

  // Fetch all Binance spot pairs (exchangeInfo)
  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      try {
        const resp = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        const symbols: Asset[] = resp.data.symbols
          .filter((s: any) => s.status === 'TRADING' && s.isSpotTradingAllowed)
          .map((s: any) => ({
            symbol: s.symbol,
            name: `${s.baseAsset}/${s.quoteAsset}`,
            assetType: 'crypto',
