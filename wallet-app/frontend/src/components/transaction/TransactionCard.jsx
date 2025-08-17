import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
} from '@mui/icons-material';

const TransactionCard = ({ transaction, onEdit, onDelete, currency }) => {
  const { type, amount, category, description, date } = transaction;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <ListItem
      sx={{
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: type === 'income' ? 'success.main' : 'error.main',
          mr: 2,
        }}
      >
        {type === 'income' ? <IncomeIcon /> : <ExpenseIcon />}
      </Box>
      <ListItemText
        primary={
