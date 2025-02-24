// src/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const requireAuth = require('../middleware/authMiddleware'); // your auth

router.get('/past-30-days-macros', requireAuth, analyticsController.getPast30DaysMacros);
router.get('/monthly-macros', requireAuth, analyticsController.getMonthlyMacros);
router.get('/weight-history', requireAuth, analyticsController.getWeightHistory);
router.get('/goal-progress', requireAuth, analyticsController.getGoalProgress);

module.exports = router;
