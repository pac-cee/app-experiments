import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
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
  Cell,
} from 'recharts';

const Reports = ({ transactions }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState('summary');

  const filteredTransactions = transactions.filter(transaction => {
    if (!startDate || !endDate) return true;
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const generateSummaryData = () => {
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      categoryExpenses: {},
      dailyTransactions: {},
    };

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpense += transaction.amount;
        summary.categoryExpenses[transaction.category.name] = 
          (summary.categoryExpenses[transaction.category.name] || 0) + transaction.amount;
      }

      const date = new Date(transaction.date).toLocaleDateString();
      if (!summary.dailyTransactions[date]) {
        summary.dailyTransactions[date] = { income: 0, expense: 0 };
      }
      summary.dailyTransactions[date][transaction.type] += transaction.amount;
