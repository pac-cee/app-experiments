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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(wallet);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(wallet._id);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
