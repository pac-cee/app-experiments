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

