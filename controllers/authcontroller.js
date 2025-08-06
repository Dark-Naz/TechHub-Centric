const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const createSendToken = (user, statusCode, res, token) => {
  const cookieOptions = {
    expires: new Date(process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24),
    httpOnly: true,
    domain: undefined,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

const hidePassword = (user) => {
  user.password = undefined;
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  });

  hidePassword(newUser);
  res.status(201).json({
    status: 'suucess',
    token,
    data: {
      user: newUser,
    },
  });
});
