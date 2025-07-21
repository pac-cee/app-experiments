import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode, SettingsBrightness } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      default:
        return <SettingsBrightness />;
    }
  };

