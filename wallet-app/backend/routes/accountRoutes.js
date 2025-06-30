const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateAccount = [
  body('name').trim().notEmpty().withMessage('Account name is required'),
  body('type').isIn(['bank', 'mobile_money', 'cash', 'credit_card', 'savings', 'investment'])
    .withMessage('Invalid account type'),
  body('balance').isNumeric().withMessage('Balance must be a number'),
  body('currency').trim().notEmpty().withMessage('Currency is required'),
  body('isDefault').optional().isBoolean(),
  body('description').optional().trim(),
  body('accountNumber').optional().trim(),
  body('bankName').optional().trim(),
  body('mobileProvider').optional().trim(),
];
