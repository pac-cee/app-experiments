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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Financial Reports
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateReport}
              sx={{ height: '56px' }}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {data && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Income
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {formatCurrency(data.totalIncome)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Expenses
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {formatCurrency(data.totalExpenses)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Net Income
                    </Typography>
                    <Typography
                      variant="h4"
