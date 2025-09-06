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
