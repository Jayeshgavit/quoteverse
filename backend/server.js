const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());

// ✅ Fix: Allow large JSON payloads (for base64 image uploads)
app.use(express.json({ limit: '5mb' })); // ⬅️ You can increase if needed
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected 🚀'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Login/Register/Profile routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('📡 QuoteVerse API is Live...');
});

// Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
