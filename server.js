const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pathRoutes = require('./routes/pathRoutes');
const authRoutes = require('./routes/authRoutes');
const initializeAdmin = require('./utils/initAdmin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', pathRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Turtle Path Tracking API is running!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully');

    // Initialize admin user
    await initializeAdmin();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
