const Quote = require('../models/Quote');

// ✅ Add new quote (POST /api/quotes)
const addQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;
    const userId = req.user.id || req.user._id;

    const newQuote = await Quote.create({
      text,
      author,
      category,
      user: userId,
    });

    res.status(201).json({ message: 'Quote added', quote: newQuote });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add quote', error: err.message });
  }
};

// ✅ Get all quotes (GET /api/quotes/all)
const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quotes', error: err.message });
  }
};

// ✅ Get quotes of logged-in user (GET /api/quotes/my)
const getUserQuotes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const quotes = await Quote.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user quotes' });
  }
};

// ✅ Like/Unlike a quote (POST /api/quotes/:id/like)
const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

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
    res.status(500).json({ message: 'Like failed', error: err.message });
  }
};

// ✅ Save/Unsave a quote (POST /api/quotes/:id/save)
const toggleSave = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

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
    res.status(500).json({ message: 'Save failed', error: err.message });
  }
};

// ✅ Delete a quote (DELETE /api/quotes/:id)
const deleteQuote = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const quote = await Quote.findOneAndDelete({
      _id: req.params.id,
      user: userId, // Only allow user to delete their own quote
    });

    if (!quote) {
      return res.status(403).json({ message: 'Quote not found or unauthorized' });
    }

    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quote', error: err.message });
  }
};

module.exports = {
  addQuote,
  getAllQuotes,
  getUserQuotes,
  toggleLike,
  toggleSave,
  deleteQuote, // ✅ Export it!
};
