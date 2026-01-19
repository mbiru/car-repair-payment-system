import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = () => {
  const [formData, setFormData] = useState({
    amountPaid: '',
    paymentDate: '',
    plateNumber: ''
  });
  const [payments, setPayments] = useState([]);
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchCars();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/payments');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get('/cars');
      if (response.data.success) {
        setCars(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.amountPaid || !formData.paymentDate || !formData.plateNumber) {
      setError('All fields are required');
      return;
    }

    const amount = parseFloat(formData.amountPaid);
    if (isNaN(amount) || amount < 0) {
      setError('Amount paid must be a valid positive number');
      return;
    }

    try {
      const response = await axios.post('/payments', {
        amountPaid: amount,
        paymentDate: formData.paymentDate,
        plateNumber: formData.plateNumber
      });
      if (response.data.success) {
        setMessage('Payment added successfully');
        setFormData({
          amountPaid: '',
          paymentDate: '',
          plateNumber: ''
        });
        fetchPayments();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding payment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Payment Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Payment</h2>
          
          {message && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount Paid (RWF) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 150000"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <select
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.PlateNumber} value={car.PlateNumber}>
                    {car.PlateNumber} - {car.Model || car.Type || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Payment
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payments List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment #</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (RWF)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.PaymentNumber}>
                      <td className="px-4 py-2 text-sm">{payment.PaymentNumber}</td>
                      <td className="px-4 py-2 text-sm">{payment.PaymentDate}</td>
                      <td className="px-4 py-2 text-sm">{payment.PlateNumber}</td>
                      <td className="px-4 py-2 text-sm">
                        {parseFloat(payment.AmountPaid).toLocaleString('en-RW')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
