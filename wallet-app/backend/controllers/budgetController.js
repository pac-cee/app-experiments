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

