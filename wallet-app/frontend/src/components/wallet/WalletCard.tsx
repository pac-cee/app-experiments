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
      return <SavingsIcon />;
    case 'investment':
      return <InvestmentIcon />;
    default:
      return <CashIcon />;
  }
};

const getWalletColor = (type: Account['type']): string => {
  switch (type) {
    case 'bank':
      return '#2196f3'; // Blue
    case 'cash':
      return '#4caf50'; // Green
    case 'mobile_money':
      return '#ff9800'; // Orange
    case 'credit_card':
      return '#f44336'; // Red
    case 'savings':
