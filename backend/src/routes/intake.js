// src/routes/intake.js
const express = require('express');
const router = express.Router();
const intakeController = require('../controllers/intakeController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/intakes
router.get('/', authenticateToken, intakeController.getIntakes);

// POST /api/intakes
router.post('/', authenticateToken, intakeController.addIntake);

module.exports = router;
