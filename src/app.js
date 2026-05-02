const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/players', require('./routes/players'));

app.get('/', (req, res) => {
  res.json({
    name: 'Table Tennis Players API',
    version: '1.0.0',
    endpoints: {
      'GET /api/players': 'Get all players',
      'GET /api/players/:id': 'Get player by ID',
      'GET /api/players?gender=Male': 'Filter by gender',
      'GET /api/players?playingStyle=Modern Defender': 'Filter by style',
      'GET /api/players?handedness=Left-handed': 'Filter by handedness',
    },
    playingStyles: [
      'Offensive - Close to Table',
      'Offensive - Far from Table',
      'Modern Defender',
      'Classical Defender',
      'Close to the Table Long Pimple Blocker'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 2137;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));