const express = require('express');
const { addQuote, getAllQuotes, getUserQuotes, deleteQuote } = require('../controllers/quoteController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, addQuote);
router.get('/', getAllQuotes);
router.get('/user', auth, getUserQuotes);
router.delete('/:id', auth, deleteQuote);

module.exports = router;
