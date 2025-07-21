import React, { Component, ErrorInfo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const MotionBox = motion(Box);

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
