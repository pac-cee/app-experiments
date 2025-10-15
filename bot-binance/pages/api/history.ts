import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';
const now = Date.now();
const generateHistory = (range: string) => {
  let points = 24;
  let interval = 60 * 60 * 1000; // 1h
  if (range === '7d') {
    points = 7 * 24;
    interval = 60 * 60 * 1000; // 1h
  } else if (range === 'all') {
    points = 365;
    interval = 24 * 60 * 60 * 1000; // 1 day
  }
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - 1 - i) * interval,
    price: (Math.random() * 10000 + 20000).toFixed(2),
  }));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { symbol, assetType, range } = req.query;
  try {
    if (assetType === 'crypto') {
      // Binance Klines API
      let interval = '1h';
      let limit = 24;
      if (range === '7d') { interval = '1h'; limit = 7 * 24; }
      if (range === 'all') { interval = '1d'; limit = 365; }
      const resp = await axios.get(`https://api.binance.com/api/v3/klines`, {
        params: { symbol, interval, limit }
      });
      const data = resp.data.map((k: any) => ({
        timestamp: k[0],
        price: parseFloat(k[4]),
      }));
      return res.status(200).json(data);
    }
