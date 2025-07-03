const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected 🚀'))
  .catch(err => console.log(err));

// Routes
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // already there for login/register

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 2200;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
