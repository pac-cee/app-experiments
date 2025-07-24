import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CategoryBreakdown } from '../../types';

interface PieChartLabelProps {
  name: string;
  percent: number;
}

interface CategoryLabelProps {
  category: {
    name: string;
  };
  percent: number;
}

interface TransactionSummaryData {
  totalIncome: number;
