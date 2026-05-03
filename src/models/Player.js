const mongoose = require('mongoose');

const birthDateRegex = /^\d{4}\/\d{2}\/\d{2}$/;

const isValidBirthDate = (value) => {
  if (!birthDateRegex.test(value)) return false;

  const [yearStr, monthStr, dayStr] = value.split('/');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

const calculateAge = (value) => {
  const [yearStr, monthStr, dayStr] = value.split('/');
  const birthYear = Number(yearStr);
  const birthMonth = Number(monthStr);
  const birthDay = Number(dayStr);

  const now = new Date();
  let age = now.getUTCFullYear() - birthYear;
  const hasHadBirthdayThisYear = (
    now.getUTCMonth() + 1 > birthMonth
    || (now.getUTCMonth() + 1 === birthMonth && now.getUTCDate() >= birthDay)
  );

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};

const serializePlayer = (_, ret) => {
  const ordered = {};
  const preferredOrder = [
    '_id',
    'firstName',
    'lastName',
    'gender',
    'birthDate',
    'age',
    'handedness',
    'grip',
    'playingStyle',
    'blade',
    'country',
    'forehand',
    'backhand',
    'createdAt',
    'updatedAt'
  ];

  preferredOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(ret, key)) {
      ordered[key] = ret[key];
    }
  });

  Object.keys(ret).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) {
      ordered[key] = ret[key];
    }
  });

  delete ordered.__v;

  return ordered;
};

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
  birthDate: {
    type: String,
    required: [true, 'Birth date is required'],
    validate: {
      validator: isValidBirthDate,
      message: 'Birth date must be in YYYY/MM/DD format and be a valid date'
    }
  },
  handedness: {
    type: String,
    required: true,
    enum: ['Right-handed', 'Left-handed']
  },
  grip: {
    type: String,
    required: [true, 'Grip is required'],
    enum: ['Shakehand', 'Chinese Penhold', 'Japanese Penhold', 'Tigerwing']
  },
  playingStyle: {
    type: String,
    required: true,
    enum: [
      'Offensive - Inverted',
      'Offensive - Long Pimples',
      'Offensive - Anti',
      'Modern Defender - Inverted',
      'Modern Defender - Long Pimples',
      'Modern Defender - Anti',
      'Classical Defender - Inverted',
      'Classical Defender - Long Pimples',
      'Classical Defender - Anti',
    ]
  },
  blade: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  forehand: {
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
  id: false,
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true, transform: serializePlayer },
  toObject: { virtuals: true, transform: serializePlayer }
});

playerSchema.virtual('age').get(function getAge() {
  return calculateAge(this.birthDate);
});

module.exports = mongoose.model('Player', playerSchema);
