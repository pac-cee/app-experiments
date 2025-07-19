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
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        type: selectedCategory.type,
        color: selectedCategory.color,
        icon: selectedCategory.icon,
      });
    }
  }, [selectedCategory]);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        type: 'expense',
        color: '#000000',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setError('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await onUpdateCategory(selectedCategory._id, formData);
      } else {
        await onAddCategory(formData);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCategory(id);
