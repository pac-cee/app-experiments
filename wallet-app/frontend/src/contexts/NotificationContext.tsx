import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface NotificationContextType {
  showNotification: (severity: AlertColor, message: string) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showNotification = useCallback((severity: AlertColor, message: string) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  }, []);

  const clearNotification = useCallback(() => {
    setOpen(false);
    // Wait for the snackbar to close before clearing the message
    setTimeout(() => {
      setMessage('');
    }, 300);
  }, []);

  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      clearNotification();
    },
    [clearNotification]
  );
