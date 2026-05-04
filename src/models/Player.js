const mongoose = require('mongoose');

const birthDateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
const UNKNOWN_VALUE = '?';
const surroundingQuotesRegex = /^['"]|['"]$/g;

const normalizeInputValue = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(surroundingQuotesRegex, '');
};

const isUnknown = (value) => normalizeInputValue(value) === UNKNOWN_VALUE;

const isValidBirthDate = (value) => {
  const normalizedValue = normalizeInputValue(value);

  if (isUnknown(normalizedValue)) return true;
  if (typeof normalizedValue !== 'string') return false;
  if (!birthDateRegex.test(normalizedValue)) return false;

  const [yearStr, monthStr, dayStr] = normalizedValue.split('/');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

const calculateAge = (value) => {
  const normalizedValue = normalizeInputValue(value);
  if (isUnknown(normalizedValue)) return UNKNOWN_VALUE;

  const [yearStr, monthStr, dayStr] = normalizedValue.split('/');
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
    'country',
    'blade',
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
    enum: ['Male', 'Female', 'Other', UNKNOWN_VALUE]
  },
  birthDate: {
    type: String,
    required: [true, 'Birth date is required'],
    set: normalizeInputValue,
    validate: {
      validator: isValidBirthDate,
      message: 'Birth date must be in YYYY/MM/DD format and be a valid date'
    }
  },
  handedness: {
    type: String,
    required: true,
    enum: ['Right-handed', 'Left-handed', UNKNOWN_VALUE]
  },
  grip: {
    type: String,
    required: [true, 'Grip is required'],
    enum: ['Shakehand', 'Chinese Penhold', 'Japanese Penhold', 'Tigerwing', UNKNOWN_VALUE]
  },
  playingStyle: {
    type: String,
    required: true,
    enum: [
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
      'Classical Defender - Anti',
      UNKNOWN_VALUE,
    ]
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  blade: {
    type: String,
    required: true,
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
