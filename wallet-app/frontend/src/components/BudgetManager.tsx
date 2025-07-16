import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Budget, Category } from '../types';

interface FormData {
  category: string;
  limit: number;
  period: 'monthly' | 'yearly';
  notifications: boolean;
  notificationThreshold?: number;
}

interface BudgetManagerProps {
  budgets: Budget[];
  categories: Category[];
  onAddBudget: (budget: FormData) => Promise<void>;
  onUpdateBudget: (id: string, budget: Partial<FormData>) => Promise<void>;
  onDeleteBudget: (id: string) => Promise<void>;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  categories,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    limit: 0,
    period: 'monthly',
    notifications: true,
    notificationThreshold: 80,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedBudget) {
      setFormData({
        category: typeof selectedBudget.category === 'object' ? selectedBudget.category._id : selectedBudget.category,
        limit: selectedBudget.limit,
        period: selectedBudget.period,
        notifications: selectedBudget.notifications,
        notificationThreshold: selectedBudget.notificationThreshold,
      });
    }
  }, [selectedBudget]);

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setSelectedBudget(budget);
    } else {
      setSelectedBudget(null);
      setFormData({
        category: '',
        limit: 0,
        period: 'monthly',
        notifications: true,
        notificationThreshold: 80,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBudget(null);
    setError('');
  };

