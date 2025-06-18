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
