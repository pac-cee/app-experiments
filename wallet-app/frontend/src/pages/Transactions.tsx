import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';
import { transactionsAPI } from '../services/transactionsAPI';
import { accountsAPI } from '../services/accountsAPI';
import { categoriesAPI } from '../services/categoriesAPI';
import { useAuth } from '../contexts/AuthContext';
import CreateTestTransactions from '../components/transaction/CreateTestTransactions';
import { Transaction, Category, Account } from '../types';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
