import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Button,
  MenuItem,
  Menu,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  CurrencyExchange as CurrencyIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const Settings: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    theme: 'light',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
