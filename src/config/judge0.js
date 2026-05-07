require('dotenv').config({ quiet: true });

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  judge0Url: process.env.JUDGE0_URL || 'http://2.24.195.236:2358',
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS) || 30000,
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 1000,
  maxPollAttempts: Number(process.env.MAX_POLL_ATTEMPTS) || 30,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 30,
  corsOrigin: process.env.CORS_ORIGIN || '*'
};

module.exports = config;
