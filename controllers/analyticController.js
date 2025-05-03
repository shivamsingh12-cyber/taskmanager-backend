const Task = require('../models/Task');  // Assuming Task is a model for your tasks
const User = require('../models/User');  // Assuming User is a model for your users

exports.getAnalytics = async (req, res) => {
  try {
    // Aggregating completed tasks per user
    const completedTasksPerUser = await Task.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          user: { $ifNull: ['$user.name', 'Unknown User'] },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' },
    });

    // Get total tasks and completed tasks
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({
      status: 'Completed',
    });

    // Calculate completion rate
    const completionRate = totalTasks > 0
      ? ((completedTasks / totalTasks) * 100).toFixed(2)
      : '0.00';

    // Return the data
    res.json({
      completedTasksPerUser,
      overdueTasks,
      completionRate,
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics failed', error: err.message });
  }
};
