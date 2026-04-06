const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./utils/errorHandler');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const { requestLogger } = require('./middleware/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
app.use(requestLogger);

// Apply global rate limiter to all routes
app.use(globalRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/budgets', budgetRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
