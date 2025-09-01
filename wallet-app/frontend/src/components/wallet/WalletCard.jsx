import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const WalletCard = ({ wallet, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
