/**
 * Central error handler — REFACTORED.
 *
 * AppError now comes from utils/AppError.js
 * NODE_ENV now comes from config/index.js
 */

const AppError = require('./../utils/AppError');
const config = require('./../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  const body = {
    error: err.message || 'Internal Server Error'
  };

  // Only leak stack traces outside production.
  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};