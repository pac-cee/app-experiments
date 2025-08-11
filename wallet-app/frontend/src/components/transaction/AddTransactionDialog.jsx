import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';

const categories = {
  income: [
    'Salary',
    'Investment',
    'Freelance',
    'Gift',
    'Other Income',
  ],
  expense: [
    'Food',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Other Expense',
  ],
};

const AddTransactionDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
