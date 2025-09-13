import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import { motion, Box as MotionBox } from 'framer-motion';
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
