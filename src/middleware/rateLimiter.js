const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter for all routes
 * Development: 1000 requests per 15 minutes
 * Production: 100 requests per 15 minutes
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit in dev
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
});

/**
 * Strict rate limiter for authentication routes
 * Development: 50 requests per minute
 * Production: 5 requests per minute
 * Applied to: /login and /register endpoints
 */
const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // Higher limit in dev
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again after a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again after a minute'
    });
  }
});

module.exports = {
  globalRateLimiter,
  authRateLimiter
};
