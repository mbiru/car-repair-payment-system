const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// INSERT - Add new payment
router.post('/', async (req, res) => {
  try {
    const { amountPaid, paymentDate, plateNumber } = req.body;

    // Validation
    if (!amountPaid || !paymentDate || !plateNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount paid, payment date, and plate number are required' 
      });
    }

    if (isNaN(amountPaid) || amountPaid < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount paid must be a valid positive number' 
      });
    }

    // Verify car exists
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

    // Insert new payment
    const [result] = await pool.execute(
      'INSERT INTO Payment (AmountPaid, PaymentDate, PlateNumber) VALUES (?, ?, ?)',
      [amountPaid, paymentDate, plateNumber]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Payment added successfully',
      paymentNumber: result.insertId
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding payment',
      error: error.message 
    });
  }
});

// GET - Get all payments
router.get('/', async (req, res) => {
  try {
    const [payments] = await pool.execute(`
      SELECT 
        p.PaymentNumber,
        p.AmountPaid,
        p.PaymentDate,
        p.PlateNumber,
        c.Type AS CarType,
        c.Model AS CarModel,
        c.DriverPhone,
        c.MechanicName
      FROM Payment p
      INNER JOIN Car c ON p.PlateNumber = c.PlateNumber
      ORDER BY p.PaymentDate DESC, p.PaymentNumber DESC
    `);

    res.json({ 
      success: true, 
      data: payments 
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments',
      error: error.message 
    });
  }
});

// GET - Get payments by plate number
router.get('/car/:plateNumber', async (req, res) => {
  try {
    const { plateNumber } = req.params;
    const [payments] = await pool.execute(`
      SELECT 
        p.PaymentNumber,
        p.AmountPaid,
        p.PaymentDate,
        p.PlateNumber,
        c.Type AS CarType,
        c.Model AS CarModel,
        c.DriverPhone,
        c.MechanicName
      FROM Payment p
      INNER JOIN Car c ON p.PlateNumber = c.PlateNumber
      WHERE p.PlateNumber = ?
      ORDER BY p.PaymentDate DESC
    `, [plateNumber]);

    res.json({ 
      success: true, 
      data: payments 
    });
  } catch (error) {
    console.error('Get payments by car error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching payments',
      error: error.message 
    });
  }
});

module.exports = router;
