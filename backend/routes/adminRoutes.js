const express = require('express');
const { verifyAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/users', verifyAdmin, adminController.getPaginatedUsers);
router.get('/user/:id/quotes', verifyAdmin, adminController.getUserQuotes);
router.get('/analytics', verifyAdmin, adminController.getAnalytics);

router.put('/user/block/:id', verifyAdmin, adminController.blockUser);
router.delete('/user/:id', verifyAdmin, adminController.deleteUser);

module.exports = router;
