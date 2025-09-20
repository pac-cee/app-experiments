import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reports: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('monthly');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start > end) {
      setError('Start date cannot be after end date');
      return false;
    }

    if (end > today) {
      setError('End date cannot be in the future');
      return false;
    }

    if (start < new Date('2000-01-01')) {
      setError('Start date cannot be before year 2000');
      return false;
    }

    // Calculate date difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      setError('Date range cannot exceed one year');
      return false;
    }

    setError('');
    return true;
  };
