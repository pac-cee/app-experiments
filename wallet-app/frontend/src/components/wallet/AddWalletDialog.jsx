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

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const AddWalletDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    balance: initialData?.balance || '',
    currency: initialData?.currency || 'USD',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      balance: parseFloat(formData.balance),
    });
    onClose();
  };

