const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected 🚀'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// ✅ Route Imports
const adminRoutes = require('./routes/adminRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const authRoutes = require('./routes/authRoutes');

// ✅ Route Middleware
app.use('/api/admin', adminRoutes);       // Admin-only routes
app.use('/api/quotes', quoteRoutes);      // All quote-related routes
app.use('/api/auth', authRoutes);         // Login/Register/Profile

// ✅ Root Endpoint
app.get('/', (req, res) => {
  res.send('📡 QuoteVerse API is Live...');
});

// ✅ Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
