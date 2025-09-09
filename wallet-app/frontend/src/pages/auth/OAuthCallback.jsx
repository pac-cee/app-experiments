import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

const OAuthCallback = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const provider = location.pathname.split('/')[2]; // Get provider from URL path

        if (!code) {
          throw new Error('No authorization code received');
        }

        let response;
        switch (provider) {
          case 'google':
            response = await authAPI.handleGoogleCallback(code);
            break;
          case 'github':
            response = await authAPI.handleGithubCallback(code);
            break;
          case 'twitter':
            response = await authAPI.handleTwitterCallback(code);
            break;
          default:
            throw new Error('Unknown provider');
        }

