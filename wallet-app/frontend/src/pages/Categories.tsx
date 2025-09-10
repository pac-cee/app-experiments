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

const initialFormData: FormData = {
  name: '',
  type: 'expense',
  color: '#1976d2'
};

const categoryTypes = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const colors = [
  { value: '#1976d2', label: 'Blue' },
  { value: '#2e7d32', label: 'Green' },
  { value: '#d32f2f', label: 'Red' },
  { value: '#ed6c02', label: 'Orange' },
  { value: '#9c27b0', label: 'Purple' },
  { value: '#0288d1', label: 'Light Blue' },
  { value: '#388e3c', label: 'Light Green' },
  { value: '#d81b60', label: 'Pink' },
];

const Categories = () => {
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
        showNotification('warning', 'No categories found');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      if (error.response?.status === 404) {
        showNotification('info', 'No categories found. Create your first category!');
      } else {
        showNotification('error', error.response?.data?.message || 'Failed to fetch categories');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category, subcategory?: SubCategory) => {
    if (subcategory) {
      setSelectedSubCategory(subcategory);
      setSelectedCategory(category || null);
      setFormData({
        name: subcategory.name,
        type: category?.type || 'expense',
        color: subcategory.color,
        parentCategoryId: category?._id || '',
      });
    } else if (category) {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        parentCategoryId: '',
      });
    } else {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
