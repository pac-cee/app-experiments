import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Report, CategoryBreakdown } from '../types';

interface ReportsProps {
  data: Report | null;
  loading: boolean;
  error: string | null;
  onGenerateReport: (startDate: string, endDate: string) => Promise<void>;
  onExportReport: (format: string) => Promise<void>;
}

interface TooltipFormatterProps {
  value: number;
}

interface PieChartEntryProps {
  category: {
    name: string;
  };
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC<ReportsProps> = ({
  data,
  loading,
  error,
  onGenerateReport,
  onExportReport,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [exportFormat, setExportFormat] = useState('pdf');

  useEffect(() => {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    setDateRange({
      startDate: firstDay,
      endDate: lastDay,
    });
  }, []);

  const handleGenerateReport = () => {
    onGenerateReport(dateRange.startDate, dateRange.endDate);
  };

  const handleExport = () => {
    onExportReport(exportFormat);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
