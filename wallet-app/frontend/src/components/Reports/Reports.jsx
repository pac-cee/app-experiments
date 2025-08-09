import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download as DownloadIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const Reports = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState('summary');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports/generate', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: reportType,
          format: reportFormat
        },
        responseType: reportFormat === 'pdf' ? 'blob' : 'json'
