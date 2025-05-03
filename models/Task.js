const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
