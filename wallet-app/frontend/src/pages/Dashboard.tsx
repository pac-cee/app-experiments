import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import { motion, Box as MotionBox } from 'framer-motion';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI, categoriesAPI } from '../services/api';
import type { Account, Transaction, Budget, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  categories: Category[];
  categoryBreakdown: {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
  trendData: {
    income: { x: string; y: number }[];
    expense: { x: string; y: number }[];
  };
}

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<DashboardSummary>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactions: [],
    accounts: [],
    budgets: [],
    categories: [],
    categoryBreakdown: [],
    trendData: {
      income: [],
      expense: []
    }
  });

  const handleError = (error: any) => {
    console.error('Dashboard error:', error);
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    setError(message);
    showNotification('error', message);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data
      const [transactionsRes, categoriesRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const transactions = transactionsRes.data;
      const categories = categoriesRes.data;

      // Process category breakdown
      const categoryBreakdown = categories.map((category: Category) => ({
        id: category.name,
        label: category.name,
        value: transactions
          .filter((t: Transaction) => t.category === category._id)
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        color: category.color,
      })).filter((c: { value: number }) => c.value > 0);

      // Process trend data
      const last3Months = Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      const trendData = {
        income: last3Months.map(month => ({
          x: month,
          y: transactions
            .filter((t: Transaction) => 
              t.type === 'income' &&
              new Date(t.date).toLocaleString('default', { month: 'short' }) === month
            )
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        })),
        expense: last3Months.map(month => ({
          x: month,
          y: transactions
            .filter((t: Transaction) => 
              t.type === 'expense' &&
              new Date(t.date).toLocaleString('default', { month: 'short' }) === month
            )
            .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        })),
      };

      setSummary({
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        transactions,
        accounts: [],
        budgets: [],
        categories,
        categoryBreakdown,
        trendData,
      });

      // Check budget notifications
      summary.budgets.forEach((budget: Budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        if (percentage >= budget.notificationThreshold) {
          const category = typeof budget.category === 'string' 
            ? summary.categories.find((c: Category) => c._id === budget.category) 
            : budget.category;
          
          if (!category) return;
          
          showNotification(
            'warning',
            `Budget Alert: ${category.name} is at ${percentage.toFixed(1)}% of limit`
          );
        }
      });

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading your financial summary...
        </Typography>
      </Box>
    );
  }

  const MotionCard = motion(Card);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your financial summary
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={loading}>
          <RefreshIcon fontSize="medium" />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Total Balance Card */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
              p: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total Balance</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => window.location.href = '/accounts'}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
