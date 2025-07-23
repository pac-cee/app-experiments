import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';

interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBudget: number;
  monthlyExpenses: number;
}

interface SummaryProps {
  data: SummaryData;
}

const Summary: React.FC<SummaryProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateBudgetProgress = (): number => {
    if (data.monthlyBudget === 0) return 0;
    return Math.min((data.monthlyExpenses / data.monthlyBudget) * 100, 100);
