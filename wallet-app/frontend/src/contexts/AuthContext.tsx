import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { User, LoginForm, RegisterForm } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginForm) => Promise<User | void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearError: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const handleError = (error: any) => {
    console.error('Auth error:', error);
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else if (error.message) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
    throw error;
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await authAPI.verify();
      if (response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password, remember = true }: LoginForm) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await authAPI.login({ email, password });
      
      if (!data || !data.token) {
        throw new Error('Invalid response from server');
      }

      // Store token
      if (remember) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      // Get user profile
      const profileResponse = await authAPI.verify();
      if (!profileResponse.data) {
        throw new Error('Failed to get user profile');
      }

      // Set user data
      setUser(profileResponse.data);
      setError(null);
      return profileResponse.data;
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, confirmPassword }: RegisterForm) => {
    try {
      setLoading(true);
      setError(null);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      await authAPI.register({ name, email, password });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
