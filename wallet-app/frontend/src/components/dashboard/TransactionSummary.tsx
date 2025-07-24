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
  totalExpenses: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  categoryBreakdown: CategoryBreakdown[];
}

interface TransactionSummaryProps {
  data: TransactionSummaryData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ data }) => {
  const theme = useTheme();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardContent>
            <Typography variant="subtitle2">{label}</Typography>
            {payload.map((entry: any, index: number) => (
              <Box key={index} sx={{ color: entry.color }}>
                <Typography variant="body2">
                  {entry.name}: {formatCurrency(entry.value)}
                </Typography>
              </Box>
            ))}
