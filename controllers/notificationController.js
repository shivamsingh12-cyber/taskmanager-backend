const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  console.log("Fetching notifications...");
  try {
    const notes = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
