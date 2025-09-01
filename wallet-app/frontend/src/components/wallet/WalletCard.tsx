import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AccountBalance as BankIcon,
  AccountBalanceWallet as CashIcon,
  Phone as MobileIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  TrendingUp as InvestmentIcon,
} from '@mui/icons-material';
import { Account } from '../../types';

interface WalletCardProps {
  wallet: Account;
  onEdit: (wallet: Account) => void;
  onDelete: (walletId: string) => Promise<void>;
}

const getWalletIcon = (type: Account['type']) => {
  switch (type) {
    case 'bank':
      return <BankIcon />;
    case 'cash':
      return <CashIcon />;
    case 'mobile_money':
      return <MobileIcon />;
    case 'credit_card':
      return <CreditCardIcon />;
    case 'savings':
