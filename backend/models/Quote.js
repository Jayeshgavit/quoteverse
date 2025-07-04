const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: String,
  author: String,
  category: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },     // ✅ Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);
