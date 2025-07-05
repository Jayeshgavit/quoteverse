const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register New User
const register = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic || undefined,
    });

    await newUser.save();
    res.status(201).json({ message: '✅ User registered successfully' });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: '❌ Server error during registration' });
  }
};

// ✅ Login User (with Role)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: '❌ Invalid credentials' });

    // ✅ Check if account is blocked
    if (user.blocked) return res.status(403).json({ message: '🚫 Account is blocked by Admin' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '❌ Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role, // 👈 Add role in JWT
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Dev logging
    console.log('🔑 JWT Payload:', { userId: user._id, role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '❌ Server error during login' });
  }
};

// ✅ Get Logged-in User Info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email role profilePic');
    if (!user) return res.status(404).json({ message: '❌ User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch user info', error: error.message });
  }
};

// ✅ Update Profile Picture
const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { profilePic },
      { new: true }
    ).select('name email role profilePic');

    res.json({ message: '✅ Profile picture updated', user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: '❌ Failed to update profile picture', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfilePic,
};
