const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addQuote, getUserQuotes, getAllQuotes } = require('../controllers/quoteController');


router.post('/', verifyToken, addQuote);
router.get('/my', verifyToken, getUserQuotes);
router.get('/all', getAllQuotes); // ✅ NEW public route (no auth needed)

module.exports = router;
