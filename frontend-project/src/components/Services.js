import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [formData, setFormData] = useState({
    serviceName: '',
    servicePrice: ''
  });
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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

    if (!formData.serviceName || !formData.servicePrice) {
      setError('Service name and price are required');
      return;
    }

    const price = parseFloat(formData.servicePrice);
    if (isNaN(price) || price < 0) {
      setError('Service price must be a valid positive number');
      return;
    }

    try {
      const response = await axios.post('/services', {
        serviceName: formData.serviceName,
        servicePrice: price
      });
      if (response.data.success) {
        setMessage('Service added successfully');
        setFormData({
          serviceName: '',
          servicePrice: ''
        });
        fetchServices();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding service');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Services Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
          
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
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engine repair"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Service Price (RWF) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="servicePrice"
                value={formData.servicePrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 150000"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Service
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Services List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (RWF)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.ServiceCode}>
                      <td className="px-4 py-2 text-sm">{service.ServiceCode}</td>
                      <td className="px-4 py-2 text-sm">{service.ServiceName}</td>
                      <td className="px-4 py-2 text-sm">
                        {parseFloat(service.ServicePrice).toLocaleString('en-RW')}
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

export default Services;
