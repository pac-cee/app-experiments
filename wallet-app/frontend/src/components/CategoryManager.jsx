import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
} from '@mui/material';
import { Add, Edit, Delete, Category } from '@mui/icons-material';
import { ChromePicker } from 'react-color';

const CategoryManager = ({ categories, onAdd, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#1976d2',
    icon: 'category',
    parent: null,
  });

  const handleOpen = (category = null) => {
    if (category) {
      setEditMode(true);
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        parent: category.parent,
      });
    } else {
      setEditMode(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        type: 'expense',
        color: '#1976d2',
        icon: 'category',
        parent: null,
      });
    }
    setOpen(true);
  };
