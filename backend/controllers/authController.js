const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePic || undefined,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully ✅' });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

   // FIX THIS LINE:
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });


    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ✅ Get Logged-in User Info
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email profilePic'); // ✅ fixed req.userId
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info', error: err.message });
  }
};

// ✅ Update Profile Picture
const updateProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,                    // ✅ fixed this
      { profilePic },
      { new: true }
    ).select('name email profilePic');
    res.json({ message: 'Profile picture updated ✅', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile picture', error: err.message });
  }
};


module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfilePic,
};
