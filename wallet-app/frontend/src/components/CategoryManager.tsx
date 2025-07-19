import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
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
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Category } from '../types';

interface FormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: FormData) => Promise<void>;
  onUpdateCategory: (id: string, category: Partial<FormData>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  loading?: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  loading = false,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'expense',
    color: '#000000',
  });
  const [error, setError] = useState('');

  useEffect(() => {
