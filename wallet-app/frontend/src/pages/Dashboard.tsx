import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import { motion, Box as MotionBox } from 'framer-motion';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI, categoriesAPI } from '../services/api';
import type { Account, Transaction, Budget, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../contexts/NotificationContext';

interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  categories: Category[];
