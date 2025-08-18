import React, { useState, useEffect } from 'react';
import {
  List,
  Button,
  Box,
  Typography,
  MenuItem,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TransactionCard from './TransactionCard';
import AddTransactionDialog from './AddTransactionDialog';
import { transactionsAPI } from '../../services/api';

const TransactionList = ({ wallet, onTransactionChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [wallet._id]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.getAll(wallet._id);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.delete(transactionId);
        onTransactionChange();
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleDialogSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await transactionsAPI.update(editingTransaction._id, {
          ...data,
          walletId: wallet._id,
        });
      } else {
        await transactionsAPI.create({
          ...data,
          walletId: wallet._id,
        });
      }
