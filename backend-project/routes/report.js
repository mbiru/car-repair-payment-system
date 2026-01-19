const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET - Daily report (services and payments per car)
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date parameter is required (format: YYYY-MM-DD)' 
      });
    }

    // Get services for the date
    const [services] = await pool.execute(`
      SELECT 
        sr.RecordNumber,
        sr.ServiceDate,
        sr.PlateNumber,
        c.Type AS CarType,
        c.Model AS CarModel,
        c.DriverPhone,
        c.MechanicName,
        s.ServiceName,
        s.ServicePrice
      FROM ServiceRecord sr
      INNER JOIN Car c ON sr.PlateNumber = c.PlateNumber
      INNER JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.ServiceDate = ?
      ORDER BY sr.PlateNumber, sr.RecordNumber
    `, [date]);

    // Get payments for the date
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
      WHERE p.PaymentDate = ?
      ORDER BY p.PlateNumber, p.PaymentNumber
    `, [date]);

    // Calculate totals
    const totalServices = services.reduce((sum, s) => sum + parseFloat(s.ServicePrice || 0), 0);
    const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.AmountPaid || 0), 0);

    // Group by car
    const carMap = new Map();

    services.forEach(service => {
      if (!carMap.has(service.PlateNumber)) {
        carMap.set(service.PlateNumber, {
          plateNumber: service.PlateNumber,
          carType: service.CarType,
          carModel: service.CarModel,
          driverPhone: service.DriverPhone,
          mechanicName: service.MechanicName,
          services: [],
          payments: [],
          totalServiceAmount: 0,
          totalPaymentAmount: 0
        });
      }
      const car = carMap.get(service.PlateNumber);
      car.services.push(service);
      car.totalServiceAmount += parseFloat(service.ServicePrice || 0);
    });

    payments.forEach(payment => {
      if (!carMap.has(payment.PlateNumber)) {
        carMap.set(payment.PlateNumber, {
          plateNumber: payment.PlateNumber,
          carType: payment.CarType,
          carModel: payment.CarModel,
          driverPhone: payment.DriverPhone,
          mechanicName: payment.MechanicName,
          services: [],
          payments: [],
          totalServiceAmount: 0,
          totalPaymentAmount: 0
        });
      }
      const car = carMap.get(payment.PlateNumber);
      car.payments.push(payment);
      car.totalPaymentAmount += parseFloat(payment.AmountPaid || 0);
    });

    const reportData = Array.from(carMap.values());

    res.json({ 
      success: true, 
      date,
      data: reportData,
      summary: {
        totalServices: services.length,
        totalPayments: payments.length,
        totalServiceAmount: totalServices,
        totalPaymentAmount: totalPayments,
        netAmount: totalServices - totalPayments
      }
    });
  } catch (error) {
    console.error('Daily report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating daily report',
      error: error.message 
    });
  }
});

// GET - Generate bill for a car
router.get('/bills/:plateNumber', async (req, res) => {
  try {
    const { plateNumber } = req.params;

    // Get car details
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

    const car = cars[0];

    // Get all service records for this car
    const [serviceRecords] = await pool.execute(`
      SELECT 
        sr.RecordNumber,
        sr.ServiceDate,
        sr.ServiceCode,
        s.ServiceName,
        s.ServicePrice
      FROM ServiceRecord sr
      INNER JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.PlateNumber = ?
      ORDER BY sr.ServiceDate DESC, sr.RecordNumber DESC
    `, [plateNumber]);

    // Get all payments for this car
    const [payments] = await pool.execute(
      'SELECT PaymentNumber, AmountPaid, PaymentDate FROM Payment WHERE PlateNumber = ? ORDER BY PaymentDate DESC',
      [plateNumber]
    );

    // Calculate totals
    const totalServiceAmount = serviceRecords.reduce((sum, sr) => sum + parseFloat(sr.ServicePrice || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.AmountPaid || 0), 0);
    const balance = totalServiceAmount - totalPaid;

    // Get user info from session
    const user = req.session.user || { username: 'System' };

    const bill = {
      billDate: new Date().toISOString().split('T')[0],
      receiver: user.username,
      car: {
        plateNumber: car.PlateNumber,
        type: car.Type,
        model: car.Model,
        manufacturingYear: car.ManufacturingYear,
        driverPhone: car.DriverPhone,
        mechanicName: car.MechanicName
      },
      services: serviceRecords,
      payments: payments,
      totals: {
        totalServiceAmount: totalServiceAmount,
        totalPaid: totalPaid,
        balance: balance
      }
    };

    res.json({ 
      success: true, 
      data: bill 
    });
  } catch (error) {
    console.error('Generate bill error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating bill',
      error: error.message 
    });
  }
});

module.exports = router;
