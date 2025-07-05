const Quote = require('../models/Quote');

// ✅ Add new quote
const addQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;
    const userId = req.userId;

    const newQuote = await Quote.create({
      text,
      author,
      category,
      user: userId,
    });

    res.status(201).json({ message: 'Quote added ✅', quote: newQuote });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add quote', error: err.message });
  }
};

// ✅ Get all quotes (public) with pagination
// const getAllQuotes = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     const totalQuotes = await Quote.countDocuments();
//     const quotes = await Quote.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('user', 'name');

//     const hasMore = skip + limit < totalQuotes;

//     res.status(200).json({ quotes, hasMore });
//   } catch (err) {
//     res.status(500).json({ message: '❌ Failed to fetch quotes', error: err.message });
//   }
// };

// ✅ Get all quotes (for public and admin use)
const getAllQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalQuotes = await Quote.countDocuments();

    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email role');

    const hasMore = skip + limit < totalQuotes;

    res.status(200).json({ quotes, total: totalQuotes, hasMore });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch quotes', error: err.message });
  }
};


// ✅ Get only current user's quotes (with pagination)
const getUserQuotes = async (req, res) => {
 
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const quotes = await Quote.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments({ user: userId });
    const hasMore = skip + limit < total;

    res.status(200).json({ quotes, total, hasMore });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user quotes' });
  }
};

// ✅ Like/Unlike quote
const toggleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    const alreadyLiked = quote.likedBy.includes(userId);

    if (alreadyLiked) {
      quote.likedBy.pull(userId);
      quote.likes -= 1;
    } else {
      quote.likedBy.push(userId);
      quote.likes += 1;
    }

    await quote.save();
    res.status(200).json({
      message: alreadyLiked ? 'Unliked' : 'Liked',
      likes: quote.likes,
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Like failed', error: err.message });
  }
};

// ✅ Save/Unsave quote
const toggleSave = async (req, res) => {
  try {
    const userId = req.userId;
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    const alreadySaved = quote.savedBy.includes(userId);

    if (alreadySaved) {
      quote.savedBy.pull(userId);
    } else {
      quote.savedBy.push(userId);
    }

    await quote.save();
    res.status(200).json({
      message: alreadySaved ? 'Unsaved' : 'Saved',
      saved: !alreadySaved,
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Save failed', error: err.message });
  }
};

// ✅ Delete a quote (only user's own)
const deleteQuote = async (req, res) => {
  try {
    const userId = req.userId;
    const quote = await Quote.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!quote) {
      return res.status(403).json({ message: 'Quote not found or unauthorized' });
    }

    res.status(200).json({ message: '✅ Quote deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to delete quote', error: err.message });
  }
};

// ✅ Get Top 5 Most Recent Quotes (For Home Page)
const getRecentQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch recent quotes', error: err.message });
  }
};

module.exports = {
  addQuote,
  getAllQuotes,
  getUserQuotes,      // ✅ Properly exported now
  toggleLike,
  toggleSave,
  deleteQuote,
  getRecentQuotes,
};
