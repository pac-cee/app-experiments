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
