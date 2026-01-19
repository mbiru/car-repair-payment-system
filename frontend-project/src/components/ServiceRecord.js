import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceRecord = () => {
  const [formData, setFormData] = useState({
    serviceDate: '',
    plateNumber: '',
    serviceCode: ''
  });
  const [editData, setEditData] = useState(null);
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
    fetchCars();
    fetchServices();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('/service-records');
      if (response.data.success) {
        setRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
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

    if (!formData.serviceDate || !formData.plateNumber || !formData.serviceCode) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('/service-records', formData);
      if (response.data.success) {
        setMessage('Service record added successfully');
        setFormData({
          serviceDate: '',
          plateNumber: '',
          serviceCode: ''
        });
        fetchRecords();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding service record');
    }
  };

  const handleEdit = async (recordNumber) => {
    try {
      const response = await axios.get(`/service-records/${recordNumber}`);
      if (response.data.success) {
        const record = response.data.data;
        setEditData(record);
        setFormData({
          serviceDate: record.ServiceDate,
          plateNumber: record.PlateNumber,
          serviceCode: record.ServiceCode.toString()
        });
      }
    } catch (error) {
      setError('Error fetching record for edit');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.serviceDate || !formData.plateNumber || !formData.serviceCode) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.put(`/service-records/${editData.RecordNumber}`, formData);
      if (response.data.success) {
        setMessage('Service record updated successfully');
        setEditData(null);
        setFormData({
          serviceDate: '',
          plateNumber: '',
          serviceCode: ''
        });
        fetchRecords();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating service record');
    }
  };

  const handleDelete = async (recordNumber) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const response = await axios.delete(`/service-records/${recordNumber}`);
      if (response.data.success) {
        setMessage('Service record deleted successfully');
        fetchRecords();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting service record');
    }
  };

  const handleRetrieve = async (recordNumber) => {
    try {
      const response = await axios.get(`/service-records/${recordNumber}`);
      if (response.data.success) {
        const record = response.data.data;
        alert(`Record Details:\n\nRecord Number: ${record.RecordNumber}\nService Date: ${record.ServiceDate}\nPlate Number: ${record.PlateNumber}\nCar Type: ${record.CarType}\nCar Model: ${record.CarModel}\nService: ${record.ServiceName}\nPrice: ${parseFloat(record.ServicePrice).toLocaleString('en-RW')} RWF`);
      }
    } catch (error) {
      setError('Error retrieving record');
    }
  };

  const cancelEdit = () => {
    setEditData(null);
    setFormData({
      serviceDate: '',
      plateNumber: '',
      serviceCode: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Service Records Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editData ? 'Edit Service Record' : 'Add New Service Record'}
          </h2>
          
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

          <form onSubmit={editData ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Service Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="serviceDate"
                value={formData.serviceDate}
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

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                name="serviceCode"
                value={formData.serviceCode}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.ServiceCode} value={service.ServiceCode}>
                    {service.ServiceName} - {parseFloat(service.ServicePrice).toLocaleString('en-RW')} RWF
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editData ? 'Update Record' : 'Add Record'}
              </button>
              {editData && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Service Records List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Record #</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                    No service records found
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.RecordNumber}>
                    <td className="px-4 py-2 text-sm">{record.RecordNumber}</td>
                    <td className="px-4 py-2 text-sm">{record.ServiceDate}</td>
                    <td className="px-4 py-2 text-sm">{record.PlateNumber}</td>
                    <td className="px-4 py-2 text-sm">{record.ServiceName}</td>
                    <td className="px-4 py-2 text-sm">
                      {parseFloat(record.ServicePrice).toLocaleString('en-RW')} RWF
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRetrieve(record.RecordNumber)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(record.RecordNumber)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.RecordNumber)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceRecord;
