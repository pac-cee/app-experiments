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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'date'
  });

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleOpenDialog = () => {
    setSelectedTransaction(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (event: SelectChangeEvent<'all' | 'income' | 'expense'>) => {
    setFilters((prev) => ({
      ...prev,
      type: event.target.value as 'all' | 'income' | 'expense',
