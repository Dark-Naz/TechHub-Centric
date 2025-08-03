const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

module.exports = app;
