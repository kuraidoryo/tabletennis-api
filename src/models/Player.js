const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  age: {
    type: Number,
    required: true,
    min: 5,
    max: 100
  },
  handedness: {
    type: String,
    required: true,
    enum: ['Right-handed', 'Left-handed']
  },
  playingStyle: {
    type: String,
    required: true,
    enum: [
      'Offensive - Close to Table',
      'Offensive - Far from Table',
      'Modern Defender',
      'Classical Defender',
      'Long Pimple Close to the Table',
      'Anti Close to the Table'
    ]
  },
  blade: {
    type: String,
    required: true,
    trim: true
  },
  forehands: {
    type: String,
    required: true,
    trim: true
  },
  backhand: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);