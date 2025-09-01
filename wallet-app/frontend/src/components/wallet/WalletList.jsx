import React, { useState } from 'react';
import { Grid, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import WalletCard from './WalletCard';
import AddWalletDialog from './AddWalletDialog';
import { walletsAPI } from '../../services/api';

const WalletList = ({ wallets, onWalletChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  const handleAddClick = () => {
    setEditingWallet(null);
    setDialogOpen(true);
  };

  const handleEditClick = (wallet) => {
    setEditingWallet(wallet);
    setDialogOpen(true);
