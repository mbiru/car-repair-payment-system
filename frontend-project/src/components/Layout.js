import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">CRPMS</h1>
          <p className="text-sm text-gray-400 mt-1">Car Repair Payment Management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/cars"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cars
          </Link>
          <Link
            to="/services"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Services
          </Link>
          <Link
            to="/service-records"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Service Records
          </Link>
          <Link
            to="/payments"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Payments
          </Link>
          <Link
            to="/reports"
            className="block px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="mb-2 text-sm text-gray-400">
            Logged in as: <span className="text-white font-semibold">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile Menu Toggle (hidden on desktop) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">CRPMS</h1>
          <button className="text-white">☰</button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
