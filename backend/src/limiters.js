// src/limiters.js
const rateLimit = require('express-rate-limit');

// A limiter for login endpoints: limit repeated login attempts per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // allow only 5 login attempts per IP per 15 minutes
  message: { error: { code: 429, message: 'Too many login attempts. Please try again later.' } },
});

// A limiter for password reset endpoints
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // allow only 3 requests per IP per hour
  message: { error: { code: 429, message: 'Too many password reset requests. Please try again later.' } },
});

module.exports = { loginLimiter, passwordResetLimiter };
