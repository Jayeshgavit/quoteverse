// const mongoose = require('mongoose');

// const quoteSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   author: { type: String, required: true },
//   category: { type: String, required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Quote', quoteSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
