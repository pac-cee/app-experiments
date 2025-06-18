const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to get user info from social profile
const createUserFromSocialProfile = async (profile, provider) => {
  const email = profile.email;
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user if doesn't exist
    user = await User.create({
      name: profile.name,
      email: profile.email,
      password: jwt.sign({ date: Date.now() }, process.env.JWT_SECRET), // Generate random secure password
      provider,
      providerId: profile.id,
    });
  }

  return user;
};

// @desc    Handle Google OAuth callback
// @route   POST /api/auth/google/callback
// @access  Public
const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
