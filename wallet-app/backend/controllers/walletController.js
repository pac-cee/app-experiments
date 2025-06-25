const asyncHandler = require('express-async-handler');
const Wallet = require('../models/walletModel');

// @desc    Create new wallet
// @route   POST /api/wallets
// @access  Private
const createWallet = asyncHandler(async (req, res) => {
  const { name, balance, currency, accountType } = req.body;

  if (!accountType) {
    res.status(400);
    throw new Error('Account type is required (bank, mobile_money, cash, or other)');
  }

  const wallet = await Wallet.create({
    user: req.user._id,
    name,
    balance,
    currency,
    accountType,
  });

  res.status(201).json(wallet);
});

// @desc    Get user wallets
// @route   GET /api/wallets
// @access  Private
const getWallets = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find({ user: req.user._id });
  res.json(wallets);
});

// @desc    Get wallet by ID
// @route   GET /api/wallets/:id
// @access  Private
const getWalletById = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);
