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

const categories = {
  income: [
    'Salary',
    'Investment',
    'Freelance',
    'Gift',
    'Other Income',
