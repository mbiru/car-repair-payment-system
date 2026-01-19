const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// INSERT - Add new service record
router.post('/', async (req, res) => {
  try {
    const { serviceDate, plateNumber, serviceCode } = req.body;

    // Validation
    if (!serviceDate || !plateNumber || !serviceCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service date, plate number, and service code are required' 
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

    // Verify service exists
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

    // Insert new service record
    const [result] = await pool.execute(
      'INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode) VALUES (?, ?, ?)',
      [serviceDate, plateNumber, serviceCode]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Service record added successfully',
      recordNumber: result.insertId
    });
  } catch (error) {
    console.error('Add service record error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding service record',
      error: error.message 
    });
  }
});

// GET - Get all service records with details
router.get('/', async (req, res) => {
  try {
    const [records] = await pool.execute(`
      SELECT 
        sr.RecordNumber,
        sr.ServiceDate,
        sr.PlateNumber,
        sr.ServiceCode,
        c.Type AS CarType,
        c.Model AS CarModel,
        c.DriverPhone,
        c.MechanicName,
        s.ServiceName,
        s.ServicePrice
      FROM ServiceRecord sr
      INNER JOIN Car c ON sr.PlateNumber = c.PlateNumber
      INNER JOIN Services s ON sr.ServiceCode = s.ServiceCode
      ORDER BY sr.ServiceDate DESC, sr.RecordNumber DESC
    `);

    res.json({ 
      success: true, 
      data: records 
    });
  } catch (error) {
    console.error('Get service records error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service records',
      error: error.message 
    });
  }
});

// GET - Get service record by record number
router.get('/:recordNumber', async (req, res) => {
  try {
    const { recordNumber } = req.params;
    const [records] = await pool.execute(`
      SELECT 
        sr.RecordNumber,
        sr.ServiceDate,
        sr.PlateNumber,
        sr.ServiceCode,
        c.Type AS CarType,
        c.Model AS CarModel,
        c.DriverPhone,
        c.MechanicName,
        s.ServiceName,
        s.ServicePrice
      FROM ServiceRecord sr
      INNER JOIN Car c ON sr.PlateNumber = c.PlateNumber
      INNER JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.RecordNumber = ?
    `, [recordNumber]);

    if (records.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service record not found' 
      });
    }

    res.json({ 
      success: true, 
      data: records[0] 
    });
  } catch (error) {
    console.error('Get service record error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching service record',
      error: error.message 
    });
  }
});

// PUT - Update service record
router.put('/:recordNumber', async (req, res) => {
  try {
    const { recordNumber } = req.params;
    const { serviceDate, plateNumber, serviceCode } = req.body;

    // Validation
    if (!serviceDate || !plateNumber || !serviceCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Service date, plate number, and service code are required' 
      });
    }

    // Check if record exists
    const [existingRecords] = await pool.execute(
      'SELECT * FROM ServiceRecord WHERE RecordNumber = ?',
      [recordNumber]
    );

    if (existingRecords.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service record not found' 
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

    // Verify service exists
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

    // Update service record
    await pool.execute(
      'UPDATE ServiceRecord SET ServiceDate = ?, PlateNumber = ?, ServiceCode = ? WHERE RecordNumber = ?',
      [serviceDate, plateNumber, serviceCode, recordNumber]
    );

    res.json({ 
      success: true, 
      message: 'Service record updated successfully' 
    });
  } catch (error) {
    console.error('Update service record error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating service record',
      error: error.message 
    });
  }
});

// DELETE - Delete service record
router.delete('/:recordNumber', async (req, res) => {
  try {
    const { recordNumber } = req.params;

    // Check if record exists
    const [existingRecords] = await pool.execute(
      'SELECT * FROM ServiceRecord WHERE RecordNumber = ?',
      [recordNumber]
    );

    if (existingRecords.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service record not found' 
      });
    }

    // Delete service record
    await pool.execute(
      'DELETE FROM ServiceRecord WHERE RecordNumber = ?',
      [recordNumber]
    );

    res.json({ 
      success: true, 
      message: 'Service record deleted successfully' 
    });
  } catch (error) {
    console.error('Delete service record error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting service record',
      error: error.message 
    });
  }
});

module.exports = router;
