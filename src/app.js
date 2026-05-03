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
      'GET /api/players': 'Get all players (filters: gender, handedness, grip, firstName, lastName, country, playingStyle)',
      'GET /api/players/:id': 'Get player by ID',
      'GET /api/players?gender=Male': 'Filter by gender',
      'GET /api/players?grip=Shakehand': 'Filter by grip',
      'GET /api/players?country=Poland': 'Filter by country (case-insensitive)',
      'GET /api/players?firstName=timo&lastName=boll': 'Filter by first/last name (case-insensitive)',
      'GET /api/players?playingStyle=Modern Defender': 'Filter by style group',
      'GET /api/players?playingStyle=Offensive - Inverted': 'Filter by exact style',
      'GET /api/players?handedness=Left-handed': 'Filter by handedness',
      'POST /api/players': 'Add one or many players (requires x-api-key)',
      'PUT /api/players/:id': 'Update player (requires x-api-key)',
      'DELETE /api/players/:id': 'Delete player (requires x-api-key)'
    },
    playingStyles: [
      'Offensive - Inverted',
      'Offensive - Long Pimples',
      'Offensive - Short Pimples',
      'Offensive - Long and Short Pimples',
      'Offensive - Anti',
      'Modern Defender - Inverted',
      'Modern Defender - Long Pimples',
      'Modern Defender - Short Pimples',
      'Modern Defender - Long and Short Pimples',
      'Modern Defender - Anti',
      'Classical Defender - Inverted',
      'Classical Defender - Long Pimples',
      'Classical Defender - Short Pimples',
      'Classical Defender - Long and Short Pimples',
      'Classical Defender - Anti'
    ],
    grips: ['Shakehand', 'Chinese Penhold', 'Japanese Penhold', 'Tigerwing']
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 2137;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
