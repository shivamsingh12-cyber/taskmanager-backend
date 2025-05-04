const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const Notification = require('./models/Notification');
const notificationRoutes = require('./routes/notifications');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/users'); // Import the user route
const analyticsRoutes = require('./routes/analytics');




const app = express();
// ✅ Enable CORS for frontend domain
app.use(cors({
  origin: ['https://frontend-black-gamma-72.vercel.app'], // frontend URL
  credentials: true // allows cookies/auth headers
}));
app.use(express.json());

// Routes placeholder
app.get('/', (req, res) => res.send('API Running'));



// DB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));




// Add this below middleware
app.use('/api/auth', authRoutes);

app.use('/api', userRoutes); // Prefix the route with '/api' (e.g., /api/users)

// After auth routes
app.use('/api/tasks', taskRoutes);
app.use('/api', notificationRoutes); // <-- Ensure this is before any general route handling
// app.get('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/analytics', analyticsRoutes);


// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});


