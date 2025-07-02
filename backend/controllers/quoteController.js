const Quote = require('../models/Quote');

exports.addQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;
    const quote = await Quote.create({ text, author, category, user: req.user.id });
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add quote' });
  }
};

exports.getAllQuotes = async (req, res) => {
  const quotes = await Quote.find().populate('user', 'name');
  res.json(quotes);
};

exports.getUserQuotes = async (req, res) => {
  const quotes = await Quote.find({ user: req.user.id });
  res.json(quotes);
};

exports.deleteQuote = async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (quote.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }
  await quote.remove();
  res.json({ msg: 'Quote deleted' });
};
