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
