import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TransactionSummary = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    categoryBreakdown: []
  });

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return {
          start: startOfWeek(now),
          end: endOfWeek(now)
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { start, end } = getDateRange();
        const response = await axios.get('/api/transactions/summary', {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString()
          }
        });
        
        setTransactions(response.data.transactions);
        setSummary({
          totalIncome: response.data.totalIncome,
          totalExpense: response.data.totalExpense,
          categoryBreakdown: response.data.categoryBreakdown
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [timeRange]);

  const chartData = transactions.reduce((acc, transaction) => {
    const date = format(new Date(transaction.date), 'MM/dd');
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      if (transaction.type === 'income') {
        existing.income += transaction.amount;
      } else {
        existing.expense += transaction.amount;
      }
    } else {
      acc.push({
        date,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0
      });
    }
    
    return acc;
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
