const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain uppercase, lowercase, and numbers' 
      });
    }

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM User WHERE Username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO User (Username, Password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM User WHERE Username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.Password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Create session
    req.session.user = {
      userId: user.UserID,
      username: user.Username
    };

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        userId: user.UserID,
        username: user.Username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Error during login';
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Database connection error. Please check if MySQL is running.';
    } else if (error.message.includes('ER_NO_SUCH_TABLE')) {
      errorMessage = 'Database table not found. Please run the database setup script.';
    } else if (error.message) {
      errorMessage = `Login error: ${error.message}`;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout user
router.post('/logout', authMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error during logout' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  });
});

// Check authentication status
router.get('/check', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    user: req.session.user 
  });
});

module.exports = router;
