import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs } from './ui/tabs';
import AssetChart from './AssetChart';
import CandlestickChart from './CandlestickChart';

interface CoinModalProps {
  open: boolean;
  onClose: () => void;
  coin: string;
  pairSymbol: string;
  pairName: string;
  assetType: string;
  price: number | undefined;
  change: string | undefined;
  changePct: string | undefined;
  chartType: 'line' | 'candle';
  setChartType: (v: 'line' | 'candle') => void;
