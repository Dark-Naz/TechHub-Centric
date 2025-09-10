const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input your name!'],
    validate: {
      validator: function (val) {
        // At least two words, only letters and optional spaces/hyphens
        return /^[A-Za-z]+(?:[\s\-][A-Za-z]+)+$/.test(val.trim());
      },
      message: 'Please input your full name',
    },
  },
  email: {
    type: String,
    required: [true, 'Please input your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  role: {
    type: String,
    enum: ['admin', 'tutor', 'user'],
    default: 'user',
  },
  preference: {
    type: String,
    enum: ['web-design', 'mobile app design', 'collaboration', 'others'],
    required: [
      function () {
        return this.role === 'user';
      },
      'Select your preference',
    ],
  },

  // message: {
  //   type: String,
  //   validate: {
  //     validator: function (val) {
  //       if (this.role === 'user') {
  //         return !!val && val.trim().length > 0;
  //       }
  //       return true;
  //     },
  //     message: 'Input your message',
  //   },
  // },
  message: {
    type: String,
    required: [
      function () {
        return this.role === 'user';
      },
      'Input your message',
    ],
  },
  budget: {
    type: Number,
    required: [
      function () {
        return this.role === 'user';
      },
      'Please input your budget',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please comfirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match!',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('email')) return next();

  const existing = await mongoose.model('User').findOne({ email: this.email });
  if (existing) {
    return next(new Error('Email already in use'));
  }

  next();
});

userSchema.pre('validate', function (next) {
  if (!this.role) {
    this.role = 'user';
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('email')) return next();

  const existing = await mongoose.model('User').findOne({ email: this.email });
  if (existing) {
    return next(new Error('Email already in use'));
  }

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
