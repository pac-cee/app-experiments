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
  onClose: () => void;
  onAdd: (data: Transaction) => Promise<void>;
  categories: Category[];
  accounts: Account[];
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onClose,
  onAdd,
  categories,
  accounts,
}) => {
  const [formData, setFormData] = React.useState<TransactionFormData>({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    account: '',
