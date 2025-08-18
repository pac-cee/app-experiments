import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import TransactionCard from './TransactionCard';
import AddTransactionDialog from './AddTransactionDialog';
import { Transaction, Category, Account } from '../../types';

interface FilterState {
  search: string;
  type: '' | 'all' | 'income' | 'expense';
  category: string;
  account: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
}

interface FormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  notes?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onAddTransaction: (data: Omit<Transaction, '_id'>) => Promise<void>;
  onUpdateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  accounts,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
