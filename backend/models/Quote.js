const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
