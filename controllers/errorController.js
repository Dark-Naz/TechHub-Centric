const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.message}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Please input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError('Invalid token. Please login again', 401);
};

const handleJWTExpiredError = () => {
  new AppError('Your session has expired. Please login again', 401);
};

// Error handling during development
const sendErrorDev = (err, req, res) => {
  if (req.orginalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

// Error handling during production
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // operational, trusted error, send to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }

    // programming or other untrusted error: don't leak details
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'SOmething went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  ((err.status = err.status || 'error'),
    (err.statusCode = err.statusCode || 500));

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(err, res);
  }
};
