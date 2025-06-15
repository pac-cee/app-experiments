const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, type, color, icon } = req.body;

  // Validate required fields
  if (!name || !type) {
    res.status(400);
    throw new Error('Name and type are required');
  }

  // Validate type
  if (!['income', 'expense'].includes(type)) {
    res.status(400);
    throw new Error('Type must be either income or expense');
  }

  const category = await Category.create({
    name,
    type,
    color: color || '#1976d2',
    icon: icon || 'category',
    user: req.user._id,
  });

  res.status(201).json(category);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name, type, color, icon } = req.body;
