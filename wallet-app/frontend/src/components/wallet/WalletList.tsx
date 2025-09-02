import React, { useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import WalletCard from './WalletCard';
import AddWalletDialog from './AddWalletDialog';
import { Account, AccountFormData } from '../../types';

interface WalletListProps {
  wallets: Account[];
  onAddWallet: (data: AccountFormData) => Promise<void>;
  onUpdateWallet: (id: string, data: Partial<AccountFormData>) => Promise<void>;
  onDeleteWallet: (id: string) => Promise<void>;
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onAddWallet,
  onUpdateWallet,
  onDeleteWallet,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Account | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWallet(null);
  };

  const handleEdit = (wallet: Account) => {
    setSelectedWallet(wallet);
    setOpenDialog(true);
  };

  return (
