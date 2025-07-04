const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },  // ✅ like count
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ✅ who liked
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // ✅ who saved
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);

