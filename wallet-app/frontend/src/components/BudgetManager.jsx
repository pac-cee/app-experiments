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
