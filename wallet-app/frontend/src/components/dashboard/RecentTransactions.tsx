import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}
