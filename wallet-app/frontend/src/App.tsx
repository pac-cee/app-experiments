import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { theme } from './theme/theme';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingIndicator from './components/common/LoadingIndicator';
import { useAuth } from './contexts/AuthContext';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Accounts = React.lazy(() => import('./pages/Accounts'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
