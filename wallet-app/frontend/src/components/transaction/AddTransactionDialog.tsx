import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Transaction, Category, Account, TransactionFormData } from '../../types';
import { transactionsAPI } from '../../services/transactionsAPI';

interface AddTransactionDialogProps {
  open: boolean;
