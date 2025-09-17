const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;

  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    message: 'success',
    data: null,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // should be not be used for password updates, only name and email
  // check if user tries to use for password update
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Cannot update password, please use /updateMyPassword', 400)
    );
  }

  // filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename; //if we make users have a photo on their dashboard, and wish to change it

  //   update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'success',
    data: { user: updatedUser },
  });
});
