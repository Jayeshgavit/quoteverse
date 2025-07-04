const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  addQuote,
  getUserQuotes,
  getAllQuotes,
  likeQuote,
  saveQuote
} = require('../controllers/quoteController');

// 🔒 POST: Add new quote (protected)
router.post('/', verifyToken, addQuote);

// 🔒 GET: Get logged-in user's quotes
router.get('/my', verifyToken, getUserQuotes);

// 🌐 GET: Public - fetch all quotes
router.get('/all', getAllQuotes);

// 🔒 POST: Like/unlike quote
router.post('/:id/like', verifyToken, likeQuote);

// 🔒 POST: Save/unsave quote
router.post('/:id/save', verifyToken, saveQuote);

module.exports = router;
