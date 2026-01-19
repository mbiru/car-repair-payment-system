import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Car = () => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    model: '',
    manufacturingYear: '',
    driverPhone: '',
    mechanicName: ''
  });
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

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

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.plateNumber) {
      setError('Plate number is required');
      return;
    }

    if (formData.driverPhone && !validatePhone(formData.driverPhone)) {
      setError('Invalid phone number format');
      return;
    }

    try {
      const response = await axios.post('/cars', formData);
      if (response.data.success) {
        setMessage('Car added successfully');
        setFormData({
          plateNumber: '',
          type: '',
          model: '',
          manufacturingYear: '',
          driverPhone: '',
          mechanicName: ''
        });
        fetchCars();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding car');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Car Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
          
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
                Plate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., RAA 123A"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Type
              </label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sedan, SUV"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Toyota Corolla"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Manufacturing Year
              </label>
              <input
                type="number"
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2020"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Driver Phone
              </label>
              <input
                type="text"
                name="driverPhone"
                value={formData.driverPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., +250 788 123 456"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mechanic Name
              </label>
              <input
                type="text"
                name="mechanicName"
                value={formData.mechanicName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Car
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cars List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No cars found
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.PlateNumber}>
                      <td className="px-4 py-2 text-sm">{car.PlateNumber}</td>
                      <td className="px-4 py-2 text-sm">{car.Type || '-'}</td>
                      <td className="px-4 py-2 text-sm">{car.Model || '-'}</td>
                      <td className="px-4 py-2 text-sm">{car.ManufacturingYear || '-'}</td>
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

export default Car;
