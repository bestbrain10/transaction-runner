const express = require('express');

const app = express();

const catchAllErrorsMiddleware = require('./common/middlewares/catch-all-errors.middleware');
const notFoundMiddleware = require('./common/middlewares/not-found.middleware');
const indexRoute = require('./common/middlewares/index.middleware');

const authRoutes = require('./auth/routes');

const customExpress = Object.create(express().response, {
  data: {
    value(data, message = 'API response message') {
      return this.type('json').status(200).json({
        message,
        status: 'success',
        data,
      });
    },
  },
  error: {
    value(error, message = 'API response message') {
      return this.json({
        message,
        status: 'error',
        data: error,
      });
    },
  },
  errorMessage: {
    value(message = 'API response message') {
      return this.json({
        message,
        status: 'error',
        data: null,
      });
    },
  },
});

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

app.response = Object.create(customExpress);
app.use(
  '/', 
  indexRoute, 
  authRoutes
);


// catch all errors middleware
app.use(catchAllErrorsMiddleware);

// 404 catch route
app.use('*', notFoundMiddleware);

module.exports = app;
