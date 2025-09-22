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

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setError('');
  };

  const handleExportReport = async () => {
    if (!validateDateRange()) return;

    try {
      setLoading(true);
      // Call your API to generate report
      // const response = await reportsAPI.export({
      //   startDate,
      //   endDate,
      //   account: selectedAccount,
      //   category: selectedCategory,
      // });
      
      // Create and download file
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `financial-report-${startDate}-to-${endDate}.pdf`;
      // link.click();
    } catch (err: any) {
      console.error('Failed to export report:', err);
      setError('Failed to export report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sample data
  const incomeVsExpenseData = [
    {
      id: 'income',
      data: [
        { x: 'Jan', y: 3000 },
        { x: 'Feb', y: 3200 },
        { x: 'Mar', y: 2800 },
        { x: 'Apr', y: 3500 },
        { x: 'May', y: 3100 },
        { x: 'Jun', y: 3800 },
      ],
    },
    {
      id: 'expense',
      data: [
        { x: 'Jan', y: 2000 },
        { x: 'Feb', y: 2100 },
        { x: 'Mar', y: 1900 },
        { x: 'Apr', y: 2300 },
        { x: 'May', y: 2000 },
        { x: 'Jun', y: 2400 },
      ],
    },
  ];

  const categoryData = [
    { id: 'Shopping', value: 30 },
    { id: 'Transport', value: 20 },
    { id: 'Food', value: 25 },
    { id: 'Entertainment', value: 15 },
    { id: 'Others', value: 10 },
  ];

  const accountBalanceData = [
    {
      account: 'Main Bank',
      balance: 5000,
    },
    {
      account: 'Mobile Money',
      balance: 1200,
    },
    {
      account: 'Cash',
      balance: 300,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportReport}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Report'}
        </Button>
      </Box>

      <MotionCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ mb: 3 }}
      >
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Start Date"
            type="date"
