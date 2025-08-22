import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [dateFilter, setDateFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const dateMatch = !dateFilter || new Date(transaction.date).toDateString() === dateFilter.toDateString();
    const typeMatch = typeFilter === 'all' || transaction.type === typeFilter;
    return dateMatch && typeMatch;
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '16px', display: 'flex', gap: '16px' }}>
        <DatePicker
          label="Filter by date"
          value={dateFilter}
          onChange={setDateFilter}
          renderInput={(params) => <TextField {...params} />}
        />
        <TextField
          select
