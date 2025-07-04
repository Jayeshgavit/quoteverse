const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected 🚀'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // optional: exit app on failure
});

// Routes
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Login/Register routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('📡 QuoteVerse API is Live...');
});

// Start Server
const PORT = process.env.PORT || 2200;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
