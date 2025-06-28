const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  type: {
    type: String,
    required: true,
    enum: ['budget_warning', 'budget_exceeded', 'system'],
  },
  title: {
    type: String,
