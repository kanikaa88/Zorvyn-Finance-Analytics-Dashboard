// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle specific error types
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for field: ${field}`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400, errors);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again', 401);
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFieldsError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Development error response - includes stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
    
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details || null,
      stack: err.stack,
      error: err
    });
  }

  // Production error response - operational errors only
  // Stack trace is hidden for security
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details || null
    });
  }

  // Programming or unknown errors: don't leak details in production
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong'
  });
};

module.exports = { 
  AppError, 
  errorHandler
};
