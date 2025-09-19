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
