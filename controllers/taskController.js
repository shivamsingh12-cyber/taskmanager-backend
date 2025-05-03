const Task = require('../models/Task');
const Notification = require('../models/Notification');


exports.createTask = async (req, res) => {
  try {
    const { assignedTo, title } = req.body; // ✅ Extract here
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    if (assignedTo && String(assignedTo) !== String(req.user._id)) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned a new task: "${title}"`,
        createdAt: new Date(),
      });
    }

    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id).populate('assignedTo', 'name email');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, dueDate } = req.query;

    const query = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    // Add search condition (title or description)
    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add priority filter
    if (priority) {
      query.priority = priority;
    }

    // Add due date filter
    if (dueDate) {
      // Ensure dueDate is in YYYY-MM-DD format
      const start = new Date(dueDate);
      const end = new Date(dueDate);
      end.setDate(end.getDate() + 1); // Get next day for range query

      query.dueDate = {
        $gte: start,
        $lt: end
      };
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      task.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');  
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only creator can update' });
    }

    Object.assign(task, req.body);
    await task.save();

    

// Send notification only if task is being newly assigned or reassigned
if (
  assignedTo &&
  assignedTo.toString() !== req.user._id.toString() &&
  assignedTo.toString() !== task.assignedTo?.toString()
) {
  await Notification.create({
    userId: assignedTo,
    message: `You have been assigned a new task: "${task.title}"`,
  });
}


    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    console.log('Deleting task with ID:', req.params.id); 
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');   
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      console.log('User is not authorized to delete the task');
      return res.status(403).json({ message: 'Only creator can delete' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);  
    res.status(500).json({ message: 'Server error', error: err.message }); 
    
  }
};
