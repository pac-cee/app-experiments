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
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, type, category, account, sortBy = 'date', sortOrder = 'desc' } = req.query;

    // Build query
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (account) query.account = account;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(query)
      .populate('category', 'name type')
      .populate('account', 'name type currency')
      .sort(sort);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new transaction
router.post('/', auth, validateTransaction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      account: accountId,
      category,
      type,
      amount,
      description,
      date,
      notes
    } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({
      _id: accountId,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const transaction = new Transaction({
      user: req.user._id,
      account: accountId,
      category,
      type,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      notes
    });

    await transaction.save();

    // Populate category and account details
    await transaction.populate('category', 'name type');
