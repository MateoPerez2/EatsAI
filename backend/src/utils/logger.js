// src/utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // you can change this to 'debug' for more verbosity
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // include error stack in logs
    format.json()
  ),
  transports: [
    new transports.Console(),
    // Optionally log to a file:
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
