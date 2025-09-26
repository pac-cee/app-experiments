import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { code: string }) => void;
          }) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the full request details
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: `${API_URL}${config.url || ''}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.config?.data
    });
    
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized access
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
interface CategoryData {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface SubcategoryData {
  name: string;
  color: string;
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  verify: () => api.get('/auth/verify'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  updatePassword: (data: any) => api.put('/auth/password', data),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
  
  // Social login methods
  loginWithGoogle: async () => {
    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google OAuth2 client not loaded');
    }
    const googleProvider = window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
      scope: 'email profile',
      callback: async (response: { code: string }) => {
        if (response.code) {
          return api.post('/auth/google/callback', { code: response.code });
        }
      },
    });
    googleProvider.requestCode();
  },

  loginWithGithub: async () => {
    const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  },

  loginWithTwitter: async () => {
    const twitterClientId = process.env.REACT_APP_TWITTER_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/twitter/callback`;
    const scope = 'tweet.read users.read';
    
    window.location.href = `https://twitter.com/i/oauth2/authorize?client_id=${twitterClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
  },

  // Handle OAuth callbacks
  handleGoogleCallback: (code: string) => api.post('/auth/google/callback', { code }),
  handleGithubCallback: (code: string) => api.post('/auth/github/callback', { code }),
  handleTwitterCallback: (code: string) => api.post('/auth/twitter/callback', { code }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: CategoryData) => api.post('/categories', data),
  update: (id: string, data: Partial<CategoryData>) => api.put(`/categories/${id}`, data),
