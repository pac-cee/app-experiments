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
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, categoriesRes, accountsRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
        accountsAPI.getAll(),
      ]);
      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
      setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: typeof transaction.category === 'string' ? transaction.category : transaction.category._id,
        account: typeof transaction.account === 'string' ? transaction.account : transaction.account._id,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setSelectedTransaction(null);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description) {
      setError('Please enter a description');
      return;
    }

    if (!formData.amount || isNaN(Number(formData.amount))) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    if (!formData.account) {
      setError('Please select an account');
      return;
    }

    try {
      if (selectedTransaction) {
        await transactionsAPI.update(selectedTransaction._id, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    const transaction = transactions.find(t => t._id === id);
    if (!transaction) return;

    const account = getAccountById(typeof transaction.account === 'string' ? transaction.account : transaction.account._id);
    if (!account) return;

    const message = `Are you sure you want to delete this transaction?\n\nDescription: ${transaction.description}\nAmount: $${transaction.amount.toFixed(2)}\nAccount: ${account.name}\nDate: ${new Date(transaction.date).toLocaleDateString()}\n\nThis action cannot be undone.`;

    if (window.confirm(message)) {
      try {
        await transactionsAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat._id === id);
  };

  const getAccountById = (id: string) => {
    return accounts.find((account) => account._id === id);
  };

  const renderTransactionForm = () => (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        select
        label="Type"
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>
