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
