const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const { getNotifications } = require('../controllers/notificationController');

router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;
