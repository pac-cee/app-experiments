const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Create budget
// @route   POST /api/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, period, startDate, endDate, notifications } = req.body;
  
  // Check for existing budget in the same period
  const existingBudget = await Budget.findOne({
    category,
    user: req.user._id,
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });

  if (existingBudget) {
    res.status(400);
    throw new Error('A budget already exists for this category in the specified period');
  }

  const budget = await Budget.create({
    category,
    amount,
    period,
    startDate,
    endDate,
    notifications,
    user: req.user._id
  });

  res.status(201).json(budget);
});

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id })
    .populate('category', 'name type color');

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(req.user._id),
            category: mongoose.Types.ObjectId(budget.category._id),
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return {
        ...budget.toObject(),
        spent: spent[0]?.total || 0,
        remaining: budget.amount - (spent[0]?.total || 0),
        percentUsed: ((spent[0]?.total || 0) / budget.amount) * 100
