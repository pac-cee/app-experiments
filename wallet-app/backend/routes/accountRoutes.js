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

// Get all accounts for a user
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new account
router.post('/', auth, validateAccount, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      type,
      balance,
      currency,
      description,
      accountNumber,
      bankName,
      mobileProvider,
      isDefault
    } = req.body;

    // If this is the first account, make it default
    const accountCount = await Account.countDocuments({ user: req.user._id });
    const shouldBeDefault = accountCount === 0 ? true : isDefault;

    const account = new Account({
      user: req.user._id,
      name,
      type,
      balance: parseFloat(balance),
      currency,
      description,
      accountNumber,
      bankName,
      mobileProvider,
      isDefault: shouldBeDefault
    });

    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an account
router.patch('/:id', auth, validateAccount, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const updates = req.body;
    if (updates.balance) {
      updates.balance = parseFloat(updates.balance);
    }

    Object.keys(updates).forEach(update => {
      account[update] = updates[update];
    });

    await account.save();
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an account
router.delete('/:id', auth, async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
