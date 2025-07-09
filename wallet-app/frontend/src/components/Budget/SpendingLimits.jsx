import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  LinearProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const SpendingLimits = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: 0,
    period: 'monthly',
    startDate: new Date(),
    endDate: new Date(),
    notifications: {
      enabled: true,
      threshold: 80
    }
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (budget = null) => {
    if (budget) {
      setSelectedBudget(budget);
      setFormData({
        category: budget.category._id,
        amount: budget.amount,
        period: budget.period,
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
        notifications: budget.notifications
      });
    } else {
      setSelectedBudget(null);
      setFormData({
        category: '',
        amount: 0,
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
        notifications: {
          enabled: true,
          threshold: 80
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (selectedBudget) {
        await axios.put(`/api/budgets/${selectedBudget._id}`, formData);
      } else {
        await axios.post('/api/budgets', formData);
      }
      fetchBudgets();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const calculateProgress = (budget) => {
    const spent = budget.spent || 0;
    return (spent / budget.amount) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'error';
    if (progress >= 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Spending Limits</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
