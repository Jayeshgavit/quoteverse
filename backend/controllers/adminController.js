const User = require('../models/User');
const Quote = require('../models/Quote');

// Paginated non-admin users
exports.getPaginatedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: { $ne: 'admin' } })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({ role: { $ne: 'admin' } });
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Quotes for specific user
exports.getUserQuotes = async (req, res) => {
  try {
    const userId = req.params.id;
    const quotes = await Quote.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quotes' });
  }
};

// Analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: { $ne: 'admin' } });
    const quotes = await Quote.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    res.json({ users, quotes, admins });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Block user (non-admin)
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot block admin' });
    }
    await User.findByIdAndUpdate(req.params.id, { blocked: true });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user' });
  }
};

// Delete user and their quotes
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin' });
    }
    await User.findByIdAndDelete(req.params.id);
    await Quote.deleteMany({ user: req.params.id });
    res.json({ message: 'User and quotes deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
