const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');


// GET: Register the admin user (one-time setup)
router.get('/register-admin', async (req, res) => {
  try {
    const email = 'admin@turtle.com';
    const password = 'TurtlePath@2024!Admin$ecure';

    // Check if already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: true,
        message: 'Admin already exists',
        user: { id: user._id, email: user.email }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await User.create({
      email,
      password: hashedPassword
    });

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin user created successfully',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Register-admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin registration'
    });
  }
});



// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// GET verify token
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

module.exports = router;
