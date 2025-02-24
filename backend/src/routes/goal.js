const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const requireAuth = require('../middleware/authMiddleware');

router.post('/set', requireAuth, goalController.setGoal);
router.get('/', requireAuth, goalController.getGoal);

module.exports = router;
