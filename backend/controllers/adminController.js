// File: controllers/adminController.js
const User = require('../models/User');
const Quote = require('../models/Quote');

// ✅ Get all users along with their quotes
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    const allQuotes = await Quote.find().lean();

    const usersWithQuotes = users.map((user) => {
      const quotes = allQuotes.filter((q) => q.user.toString() === user._id.toString());
      return { ...user, quotes };
    });

    res.json(usersWithQuotes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Block user by ID
exports.blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user' });
  }
};

// ✅ Delete user and their quotes
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Quote.deleteMany({ user: req.params.id });
    res.json({ message: 'User and their quotes deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
