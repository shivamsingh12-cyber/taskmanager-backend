
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { getUsers } = require('../controllers/users');

// GET /users endpoint
router.get('/users',authMiddleware, getUsers);

module.exports = router;
