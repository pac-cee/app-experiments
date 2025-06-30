const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Please add a wallet name'],
  },
  accountType: {
    type: String,
    required: true,
    enum: ['bank', 'mobile_money', 'cash', 'other'],
  },
  currency: {
    type: String,
