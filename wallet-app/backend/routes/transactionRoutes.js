const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateTransaction = [
  body('account').notEmpty().withMessage('Account is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('type').isIn(['income', 'expense']).withMessage('Invalid transaction type'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('notes').optional().trim(),
];

// Get all transactions for a user
