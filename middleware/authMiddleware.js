const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Received token:', authHeader);  // Added log to see the token

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);  // Log the decoded JWT

    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user;
    console.log('Authenticated user:', req.user);  // Log the user object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
