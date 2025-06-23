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
const createTransaction = asyncHandler(async (req, res) => {
  const { walletId, type, amount, category, description } = req.body;

  // Verify wallet ownership
  const wallet = await Wallet.findById(walletId);
  if (!wallet || wallet.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Wallet not found');
  }

  // Update wallet balance
  if (type === 'income') {
    wallet.balance += amount;
  } else if (type === 'expense') {
    wallet.balance -= amount;
  }
  await wallet.save();

  const transaction = await Transaction.create({
    wallet: walletId,
    type,
    amount,
    category,
    description,
  });

  res.status(201).json(transaction);
});

// @desc    Get wallet transactions
// @route   GET /api/transactions/wallet/:walletId
// @access  Private
const getWalletTransactions = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.walletId);
  if (!wallet || wallet.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Wallet not found');
  }
