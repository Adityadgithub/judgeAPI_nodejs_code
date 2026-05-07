const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/judge0');
const logger = require('./middleware/logger');
const runRoutes = require('./routes/run');

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '256kb' }));
app.use(logger);

app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please try again later.'
    }
  })
);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    judge0Url: config.judge0Url,
    uptime: process.uptime()
  });
});

app.use(runRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.response?.status || 500;
  const details = error.response?.data;

  console.error('Request failed:', {
    message: error.message,
    statusCode,
    details
  });

  res.status(statusCode).json({
    error: error.message || 'Internal server error',
    details: config.nodeEnv === 'production' ? undefined : details
  });
});

module.exports = app;
