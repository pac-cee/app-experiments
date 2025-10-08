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
          }));
        setAssets(symbols);
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  // Fetch 24hr stats for all pairs
  useEffect(() => {
    async function fetch24hr() {
      try {
        const resp = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
        const map: Record<string, Ticker24hr> = {};
        for (const t of resp.data) {
          map[t.symbol] = t;
        }
        setTicker24(map);
      } catch {}
    }
    fetch24hr();
    const interval = setInterval(fetch24hr, 10000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket for all tickers (miniTicker stream)
  useEffect(() => {
    if (!assets.length) return;
    const ws = new window.WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const updated: Record<string, number> = {};
      for (const t of data) {
        updated[t.s] = parseFloat(t.c);
      }
      setPrices(prev => ({ ...prev, ...updated }));
      setPriceHistory(prev => {
        const next = { ...prev };
        for (const symbol in updated) {
          if (!next[symbol]) next[symbol] = [];
          next[symbol] = [...next[symbol].slice(-29), updated[symbol]]; // last 30 points
        }
        return next;
      });
    };
    return () => ws.close();
  }, [assets]);

  // --- Favorite toggle ---
  function toggleFavorite(symbol: string) {
    setFavorites((prev) => {
      let next;
      if (prev.includes(symbol)) {
        next = prev.filter(s => s !== symbol);
      } else {
        next = [...prev, symbol];
      }
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  }

  // --- Filtering, sorting, virtualization ---
  let filtered = assets.filter(asset =>
    asset.name.toLowerCase().includes(search.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(search.toLowerCase())
  );
  if (showFavorites) filtered = filtered.filter(a => favorites.includes(a.symbol));
  if (filterQuote !== 'ALL') filtered = filtered.filter(a => a.symbol.endsWith(filterQuote));
  filtered = filtered.sort((a, b) => {
    if (sortKey === 'symbol') return sortAsc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    if (sortKey === 'price') return sortAsc ? ((prices[a.symbol] || 0) - (prices[b.symbol] || 0)) : ((prices[b.symbol] || 0) - (prices[a.symbol] || 0));
    if (sortKey === 'change') return sortAsc
      ? (parseFloat(ticker24[a.symbol]?.priceChangePercent || '0') - parseFloat(ticker24[b.symbol]?.priceChangePercent || '0'))
      : (parseFloat(ticker24[b.symbol]?.priceChangePercent || '0') - parseFloat(ticker24[a.symbol]?.priceChangePercent || '0'));
    return 0;
  });

  // --- Unique coins (base assets) ---
  // --- Coins with their best pair (for price) ---
  const coins = useMemo(() => {
    // Map base asset to best pair symbol (prefer USDT, then BUSD, then any)
    const map: Record<string, { symbol: string, name: string }> = {};
    for (const asset of assets) {
      const [base, quote] = asset.name.split('/');
      if (!map[base]) {
        map[base] = { symbol: asset.symbol, name: asset.name };
      }
      // Prefer USDT
      if (quote === 'USDT') {
        map[base] = { symbol: asset.symbol, name: asset.name };
      } else if (quote === 'BUSD' && !map[base].name.endsWith('USDT')) {
        map[base] = { symbol: asset.symbol, name: asset.name };
      }
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [assets]);

  // --- All pairs for a selected coin ---
  const pairsForCoin = useMemo(() => {
    if (!selectedCoin) return [];
    return assets.filter(a => a.name.startsWith(selectedCoin + '/'));
  }, [assets, selectedCoin]);

  // --- Virtualized row renderer ---
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const asset = filtered[index];
    return (
      <TableRow
        key={asset.symbol}
        style={style}
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => { setSelected(asset); setRange('24h'); }}
      >
        <TableCell className="text-2xl" onClick={e => { e.stopPropagation(); toggleFavorite(asset.symbol); }}>
          <span title={favorites.includes(asset.symbol) ? 'Unfavorite' : 'Favorite'}>
            {favorites.includes(asset.symbol) ? '★' : '☆'}
          </span> {assetTypeIcon(asset.assetType)}
        </TableCell>
        <TableCell>{asset.name}</TableCell>
        <TableCell className="font-mono">{asset.symbol}</TableCell>
        <TableCell className="font-mono">{prices[asset.symbol] ?? '...'}</TableCell>
        <TableCell>
          {ticker24[asset.symbol] && (
            <span className={
              parseFloat(ticker24[asset.symbol].priceChange) > 0 ? 'text-green-600' : 'text-red-600'
            }>
              {parseFloat(ticker24[asset.symbol].priceChange) > 0 ? '+' : ''}
              {parseFloat(ticker24[asset.symbol].priceChange).toFixed(2)}
              {' '}({parseFloat(ticker24[asset.symbol].priceChangePercent).toFixed(2)}%)
            </span>
          )}
        </TableCell>
        <TableCell>{ticker24[asset.symbol] ? ticker24[asset.symbol].highPrice : '-'}</TableCell>
        <TableCell>{ticker24[asset.symbol] ? ticker24[asset.symbol].lowPrice : '-'}</TableCell>
      </TableRow>
    );
  };

  // --- Quote asset filter options ---
  const quoteAssets = Array.from(new Set(assets.map(a => a.symbol.slice(-4)).concat(assets.map(a => a.symbol.slice(-3))))).filter(q => q.match(/^[A-Z]+$/)).sort();

  return (
    <div className="p-8 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Trading Dashboard</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <Tabs
          value={tab}
          onValueChange={v => { setTab(v as 'pairs' | 'coins'); setSelectedCoin(null); }}
          tabs={[{ label: 'Pairs', value: 'pairs' }, { label: 'Coins', value: 'coins' }]}
        />
