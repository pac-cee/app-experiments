import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemSecondaryAction,
  Collapse,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { categoriesAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import CreateDefaultCategories from '../components/category/CreateDefaultCategories';

interface SubCategory {
  _id: string;
  name: string;
  color: string;
}

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  subcategories?: SubCategory[];
}

interface FormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  parentCategoryId?: string;
}

