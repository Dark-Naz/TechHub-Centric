const mongoose = require('mongoose');
const validator = require('validator');

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please input your name!'],
  },
  email: {
    type: String,
    require: [true, 'Please input your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
});
