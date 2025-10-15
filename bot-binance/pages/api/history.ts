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
