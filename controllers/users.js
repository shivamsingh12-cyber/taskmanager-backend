const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUsers };
