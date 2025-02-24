// src/routes/analyze.js
const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController'); // Ensure path is correct
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/analyze/image
router.post('/image', authenticateToken, analyzeController.analyzeImage);

module.exports = router;
