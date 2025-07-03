const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addQuote, getUserQuotes } = require('../controllers/quoteController');

router.post('/', verifyToken, addQuote);
router.get('/my', verifyToken, getUserQuotes);

module.exports = router;
