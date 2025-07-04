const Quote = require('../models/Quote');

// ✅ Add new quote (POST /api/quotes)
const addQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;

    const newQuote = await Quote.create({
      text,
      author,
      category,
      user: req.user.id
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
    const quotes = await Quote.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user quotes' });
  }
};

// ✅ Like/unlike a quote (POST /api/quotes/:id/like)
const likeQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    const userId = req.user.id;

    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    if (quote.likedBy.includes(userId)) {
      // Unlike
      quote.likes -= 1;
      quote.likedBy.pull(userId);
    } else {
      // Like
      quote.likes += 1;
      quote.likedBy.push(userId);
    }

    await quote.save();
    res.json({ likes: quote.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error liking quote', error: err.message });
  }
};

// ✅ Save/unsave a quote (POST /api/quotes/:id/save)
const saveQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    const userId = req.user.id;

    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    if (quote.savedBy.includes(userId)) {
      // Unsave
      quote.savedBy.pull(userId);
      await quote.save();
      return res.json({ saved: false });
    } else {
      // Save
      quote.savedBy.push(userId);
      await quote.save();
      return res.json({ saved: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error saving quote', error: err.message });
  }
};

module.exports = {
  addQuote,
  getAllQuotes,
  getUserQuotes,
  likeQuote,
  saveQuote,
};
