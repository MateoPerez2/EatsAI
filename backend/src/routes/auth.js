// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter, passwordResetLimiter } = require('../limiters');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', passwordResetLimiter, authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
