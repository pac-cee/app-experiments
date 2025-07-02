const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format'),
  body('icon').optional().notEmpty().withMessage('Icon cannot be empty if provided')
];

// Apply auth middleware to all routes
router.use(auth);

// Category routes
router.get('/', async (req, res) => {
