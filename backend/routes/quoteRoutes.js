const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  addQuote,
  getAllQuotes,
  getUserQuotes,
  toggleLike,
  toggleSave,
  deleteQuote,  // ✅ New Controller
} = require('../controllers/quoteController');

// ✅ Add a new quote (protected)
router.post('/', verifyToken, addQuote);

// ✅ Get all public quotes (no login required)
router.get('/all', getAllQuotes);

// ✅ Get quotes for the logged-in user
router.get('/my', verifyToken, getUserQuotes);

// ✅ Like/Unlike a quote
router.post('/:id/like', verifyToken, toggleLike);

// ✅ Save/Unsave a quote
router.post('/:id/save', verifyToken, toggleSave);

// ✅ Delete a user's own quote
router.delete('/:id', verifyToken, deleteQuote); // 👈 Added this route

module.exports = router;
