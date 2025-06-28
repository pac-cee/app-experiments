const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  color: {
    type: String,
    default: '#000000'
  },
  icon: {
    type: String,
    default: 'attach_money'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create default categories for new users
categorySchema.statics.createDefaultCategories = async function(userId) {
  const defaultCategories = [
