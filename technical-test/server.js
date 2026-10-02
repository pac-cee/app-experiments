const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for users
let users = {};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /users - Create a new user
app.post('/users', (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both name and email are required'
      });
    }

    // Validate field types
    if (typeof name !== 'string' || typeof email !== 'string') {
      return res.status(400).json({
        error: 'Invalid field types',
        message: 'Name and email must be strings'
      });
    }
