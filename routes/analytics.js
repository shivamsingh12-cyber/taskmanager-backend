const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticController');
const authMiddleware = require('../middleware/authMiddleware'); // ensure auth is required

// GET /api/analytics/summary
router.get('/summary', authMiddleware, getAnalytics);

module.exports = router;