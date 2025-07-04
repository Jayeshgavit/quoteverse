const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  updateProfilePic,
} = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// 🔐 Auth routes
router.post('/register', register);
router.post('/login', login);

// 👤 Profile routes
router.get('/users/me', verifyToken, getCurrentUser);
router.put('/users/profile-pic', verifyToken, updateProfilePic);

module.exports = router;
