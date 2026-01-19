import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/cars"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Cars</h2>
          <p className="text-gray-600">Manage car information</p>
        </Link>

        <Link
          to="/services"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Services</h2>
          <p className="text-gray-600">Manage available services</p>
        </Link>

        <Link
          to="/service-records"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Service Records</h2>
          <p className="text-gray-600">View and manage service records</p>
        </Link>

        <Link
          to="/payments"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Payments</h2>
          <p className="text-gray-600">Record and track payments</p>
        </Link>

        <Link
          to="/reports"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Reports</h2>
          <p className="text-gray-600">Generate daily reports and bills</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
