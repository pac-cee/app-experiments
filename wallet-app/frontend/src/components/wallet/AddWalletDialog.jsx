import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const AddWalletDialog = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    balance: initialData?.balance || '',
    currency: initialData?.currency || 'USD',
