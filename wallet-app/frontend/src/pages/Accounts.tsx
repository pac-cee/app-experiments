import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountIcon,
} from '@mui/icons-material';
import { accountsAPI } from '../services/accountsAPI';
import { useAuth } from '../contexts/AuthContext';
import { Account, AccountType, AccountFormData } from '../types';

const accountTypes = [
  { value: 'bank', label: 'Bank Account' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
];

const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'JPY', label: 'JPY' },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    balance: '',
    type: 'bank',
    currency: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setSelectedAccount(account);
      setFormData({
        name: account.name,
        balance: account.balance.toString(),
        type: account.type,
        currency: account.currency,
      });
    } else {
      setSelectedAccount(null);
      setFormData({
        name: '',
        balance: '',
        type: 'bank',
        currency: '',
      });
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as keyof AccountFormData;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    if (!formData.balance || isNaN(parseFloat(formData.balance))) {
      setError('Please enter a valid balance amount');
      return;
    }

    if (!formData.type) {
      setError('Please select an account type');
      return;
    }

    if (!formData.currency) {
      setError('Please select a currency');
      return;
    }

    try {
      const accountData: AccountFormData = {
        ...formData,
        name: formData.name.trim(),
        balance: formData.balance,
        type: formData.type as AccountType,
      };

      if (selectedAccount) {
        await accountsAPI.update(selectedAccount._id, accountData);
      } else {
        await accountsAPI.create(accountData);
      }
      handleCloseDialog();
      fetchAccounts();
    } catch (error: any) {
      console.error('Error saving account:', error);
      setError(error.response?.data?.message || 'Failed to save account');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountsAPI.delete(id);
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const getAccountTypeIcon = (type: string) => {
    return <AccountIcon />;
  };

  if (loading) {
