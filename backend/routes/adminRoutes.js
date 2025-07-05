// File: backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Get all users (with quotes)
router.get('/users', verifyAdmin, adminController.getAllUsers);

// Block user
router.put('/user/block/:id', verifyAdmin, adminController.blockUser);

// Delete user
router.delete('/user/:id', verifyAdmin, adminController.deleteUser);

module.exports = router;