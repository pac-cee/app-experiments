const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { Parser } = require('json2csv');

// @desc    Get transaction report
// @route   GET /api/reports
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, format = 'json' } = req.query;
  
  const matchStage = {
    user: req.user._id,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  const report = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        transactions: { $push: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id.category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        category: '$category.name',
        type: '$_id.type',
        total: 1,
        count: 1,
        transactions: 1
      }
    }
  ]);

  // Calculate summary
  const summary = {
    totalIncome: report
      .filter(item => item.type === 'income')
