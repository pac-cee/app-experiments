import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  Alert,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { transactionsAPI } from '../services/api';

const BudgetManager = ({ wallet, onUpdateBudget }) => {
  const [budget, setBudget] = useState({
    amount: wallet.budget?.amount || 0,
