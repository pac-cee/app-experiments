const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const accountRoutes = require('./routes/accountRoutes');
const socialAuthRoutes = require('./routes/socialAuthRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/social-auth', socialAuthRoutes);

// Error handler middleware
app.use(errorHandler);

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
