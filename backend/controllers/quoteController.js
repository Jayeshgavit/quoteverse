const Quote = require('../models/Quote');

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

const getUserQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quotes' });
  }
};

const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all quotes' });
  }
};

module.exports = {
  addQuote,
  getUserQuotes,
  getAllQuotes, // ✅ include new one here
};


