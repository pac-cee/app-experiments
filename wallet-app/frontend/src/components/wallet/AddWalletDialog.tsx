import React, { useState } from 'react';
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
  Grid,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from '@mui/material';
import { AccountType, AccountFormData } from '../../types';

interface AddWalletDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: AccountFormData) => Promise<void>;
}

const ACCOUNT_TYPES: { [key in AccountType]: string } = {
  bank: 'Bank Account',
  mobile_money: 'Mobile Money',
  cash: 'Cash',
  credit_card: 'Credit Card',
  savings: 'Savings Account',
  investment: 'Investment Account',
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'UGX', 'TZS', 'RWF'];

const MOBILE_PROVIDERS = ['Safaricom', 'Airtel', 'Telkom', 'MTN', 'Vodacom'];

const AddWalletDialog: React.FC<AddWalletDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'bank',
    balance: '',
    currency: 'USD',
    description: '',
    accountNumber: '',
    bankName: '',
    mobileProvider: '',
    isDefault: false,
  });

  const [error, setError] = useState('');

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onAdd(formData);
      onClose();
      setFormData({
        name: '',
        type: 'bank',
        balance: '',
        currency: 'USD',
        description: '',
        accountNumber: '',
        bankName: '',
        mobileProvider: '',
        isDefault: false,
      });
    } catch (err) {
      setError('Failed to add account');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Name"
                name="name"
                value={formData.name}
                onChange={handleTextChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  required
                >
                  {Object.entries(ACCOUNT_TYPES).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleSelectChange}
                  required
                >
                  {CURRENCIES.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
