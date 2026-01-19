const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// INSERT - Add new car
router.post('/', async (req, res) => {
  try {
    const { plateNumber, type, model, manufacturingYear, driverPhone, mechanicName } = req.body;

    // Validation
    if (!plateNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Plate number is required' 
      });
    }

    // Check if car already exists
    const [existingCars] = await pool.execute(
      'SELECT * FROM Car WHERE PlateNumber = ?',
      [plateNumber]
    );

    if (existingCars.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Car with this plate number already exists' 
      });
    }

    // Insert new car
    await pool.execute(
      'INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)',
      [plateNumber, type || null, model || null, manufacturingYear || null, driverPhone || null, mechanicName || null]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Car added successfully' 
    });
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding car',
      error: error.message 
    });
  }
});

// GET - Get all cars
router.get('/', async (req, res) => {
  try {
    const [cars] = await pool.execute('SELECT * FROM Car ORDER BY CreatedAt DESC');
    res.json({ 
      success: true, 
      data: cars 
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching cars',
      error: error.message 
    });
  }
});

// GET - Get car by plate number
router.get('/:plateNumber', async (req, res) => {
  try {
    const { plateNumber } = req.params;
    const [cars] = await pool.execute(
      'SELECT * FROM Car WHERE PlateNumber = ?',
      [plateNumber]
    );

    if (cars.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Car not found' 
      });
    }

    res.json({ 
      success: true, 
      data: cars[0] 
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching car',
      error: error.message 
    });
  }
});

module.exports = router;
