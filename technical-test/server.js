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

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists
    const existingUser = Object.values(users).find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'A user with this email already exists'
      });
    }

    // Generate unique ID and create user
    const id = uuidv4();
    const newUser = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase()
    };

    // Store user in memory
    users[id] = newUser;

    // Return created user with 201 status
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    });
  }
