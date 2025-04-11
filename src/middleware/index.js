const rateLimit = require('express-rate-limit');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const validateAuthCode = (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    throw new ValidationError('Authentication code is required');
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ValidationError || err instanceof AuthenticationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

module.exports = {
  ValidationError,
  AuthenticationError,
  apiLimiter,
  validateAuthCode,
  errorHandler
};