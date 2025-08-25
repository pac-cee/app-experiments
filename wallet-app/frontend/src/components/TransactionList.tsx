import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Transaction, Category, Account } from '../types';

interface TransactionFormData {
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  notes: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onUpdateTransaction: (id: string, data: Partial<TransactionFormData>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  accounts,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [error, setError] = useState('');

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: typeof transaction.category === 'object' ? transaction.category._id : transaction.category,
      account: typeof transaction.account === 'object' ? transaction.account._id : transaction.account,
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
    setError('');
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (selectedTransaction) {
        await onUpdateTransaction(selectedTransaction._id, formData);
      }

      handleCloseDialog();
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        account: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch (err) {
      setError('Failed to update transaction');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteTransaction(id);
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: string, type: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(type === 'expense' ? -parseFloat(amount) : parseFloat(amount));
  };

  return (
    <Box>
      <List>
        {transactions.map((transaction) => (
          <ListItem
            key={transaction._id}
            sx={{
