const express = require('express');
const path = require('path');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);

module.exports = app;
