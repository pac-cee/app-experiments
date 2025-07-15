import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  Alert,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { transactionsAPI } from '../services/api';

const BudgetManager = ({ wallet, onUpdateBudget }) => {
  const [budget, setBudget] = useState({
    amount: wallet.budget?.amount || 0,
    period: wallet.budget?.period || 'monthly',
    notifications: {
      enabled: wallet.budget?.notifications?.enabled || true,
      threshold: wallet.budget?.notifications?.threshold || 80,
    },
  });

  const [currentSpending, setCurrentSpending] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentSpending();
  }, [wallet._id, budget.period]);

  const fetchCurrentSpending = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getReport({
        walletId: wallet._id,
        period: budget.period,
        type: 'expense',
      });
      setCurrentSpending(response.data.total);
    } catch (err) {
      console.error('Error fetching spending:', err);
      setError('Failed to fetch current spending');
    } finally {
      setLoading(false);
    }
  };

  const spendingPercentage = (currentSpending / budget.amount) * 100;

  const handleBudgetChange = (field) => (event) => {
    setBudget((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNotificationChange = (field) => (event) => {
    setBudget((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: field === 'enabled' ? event.target.checked : event.target.value,
      },
    }));
  };

  const saveBudget = async () => {
    try {
      setError(null);
      await onUpdateBudget(budget);
      await fetchCurrentSpending();
    } catch (err) {
      setError('Failed to update budget settings');
    }
  };

  const getProgressColor = () => {
    if (spendingPercentage >= 100) return 'error';
    if (spendingPercentage >= budget.notifications.threshold) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Budget Settings for {wallet.name}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
