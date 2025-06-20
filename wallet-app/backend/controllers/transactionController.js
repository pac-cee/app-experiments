const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ date: -1 })
    .populate('category', 'name color type')
    .populate('wallet', 'name balance');
  res.json(transactions);
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
