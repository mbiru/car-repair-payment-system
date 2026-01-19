const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// INSERT - Add new service
router.post('/', async (req, res) => {
  try {
    const { serviceName, servicePrice } = req.body;

    // Validation
    if (!serviceName || servicePrice === undefined || servicePrice === null) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service name and price are required' 
      });
    }

    if (isNaN(servicePrice) || servicePrice < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service price must be a valid positive number' 
      });
    }

    // Insert new service
    const [result] = await pool.execute(
      'INSERT INTO Services (ServiceName, ServicePrice) VALUES (?, ?)',
      [serviceName, servicePrice]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Service added successfully',
      serviceCode: result.insertId
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding service',
      error: error.message 
    });
  }
});

// GET - Get all services
router.get('/', async (req, res) => {
  try {
    const [services] = await pool.execute('SELECT * FROM Services ORDER BY ServiceName');
    res.json({ 
      success: true, 
      data: services 
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching services',
      error: error.message 
    });
  }
});

// GET - Get service by code
router.get('/:serviceCode', async (req, res) => {
  try {
    const { serviceCode } = req.params;
    const [services] = await pool.execute(
      'SELECT * FROM Services WHERE ServiceCode = ?',
      [serviceCode]
    );

    if (services.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    res.json({ 
      success: true, 
      data: services[0] 
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service',
      error: error.message 
    });
  }
});

module.exports = router;
