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
