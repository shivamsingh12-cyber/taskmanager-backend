const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// ✅ New route to check if the token is valid
router.get('/check-auth', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ isAuthenticated: false });
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set
      return res.json({ isAuthenticated: true, user: decoded });
    } catch (err) {
      return res.json({ isAuthenticated: false });
    }
  });

  router.get('/notifications', async (req, res) => {
    try {
      // Assuming you have a Notifications model or a data source
      const notifications = await Notification.find(); // Adjust based on your model
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
