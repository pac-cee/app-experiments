import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import {
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';

const RecentTransactions = ({ transactions = [], currency = 'USD' }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      {transactions.length === 0 ? (
        <Typography color="text.secondary">No recent transactions</Typography>
      ) : (
        <List>
