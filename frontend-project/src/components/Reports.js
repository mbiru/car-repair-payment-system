import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [billPlateNumber, setBillPlateNumber] = useState('');
  const [dailyReport, setDailyReport] = useState(null);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDailyReport = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setBill(null);

    try {
      const response = await axios.get(`/reports/daily?date=${reportDate}`);
      if (response.data.success) {
        setDailyReport(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error generating daily report');
      setDailyReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDailyReport(null);

    if (!billPlateNumber) {
      setError('Please enter a plate number');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/reports/bills/${billPlateNumber}`);
      if (response.data.success) {
        setBill(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error generating bill');
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  const printBill = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reports & Bills</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Report Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Report</h2>
          <form onSubmit={handleDailyReport} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Daily Report'}
            </button>
          </form>
        </div>

        {/* Bill Generator Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Generate Bill</h2>
          <form onSubmit={handleGenerateBill} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Plate Number
              </label>
              <input
                type="text"
                value={billPlateNumber}
                onChange={(e) => setBillPlateNumber(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., RAA 123A"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Bill'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Daily Report Display */}
      {dailyReport && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Daily Report - {dailyReport.date}
          </h2>
          
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-lg font-bold">{dailyReport.summary.totalServices}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-lg font-bold">{dailyReport.summary.totalPayments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Service Amount</p>
                <p className="text-lg font-bold">
                  {parseFloat(dailyReport.summary.totalServiceAmount).toLocaleString('en-RW')} RWF
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-lg font-bold">
                  {parseFloat(dailyReport.summary.totalPaymentAmount).toLocaleString('en-RW')} RWF
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payments</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Service</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Paid</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyReport.data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      No records found for this date
                    </td>
                  </tr>
                ) : (
                  dailyReport.data.map((car, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm font-semibold">{car.plateNumber}</td>
                      <td className="px-4 py-2 text-sm">
                        {car.carType || 'N/A'} - {car.carModel || 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {car.services.length} service(s)
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {car.payments.length} payment(s)
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {parseFloat(car.totalServiceAmount).toLocaleString('en-RW')} RWF
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {parseFloat(car.totalPaymentAmount).toLocaleString('en-RW')} RWF
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bill Display */}
      {bill && (
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none">
          <div className="print:hidden mb-4">
            <button
              onClick={printBill}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Print Bill
            </button>
          </div>

          <div className="border-2 border-gray-300 p-8 print:border-0">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">SMARTPARK</h1>
              <p className="text-gray-600">Car Repair Payment Management System</p>
              <p className="text-gray-600">Rubavu, Rwanda</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">INVOICE / BILL</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Bill Date:</p>
                  <p className="font-semibold">{bill.billDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receiver:</p>
                  <p className="font-semibold">{bill.receiver}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Car Details</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><span className="font-semibold">Plate Number:</span> {bill.car.plateNumber}</p>
                <p><span className="font-semibold">Type:</span> {bill.car.type || 'N/A'}</p>
                <p><span className="font-semibold">Model:</span> {bill.car.model || 'N/A'}</p>
                <p><span className="font-semibold">Manufacturing Year:</span> {bill.car.manufacturingYear || 'N/A'}</p>
                <p><span className="font-semibold">Driver Phone:</span> {bill.car.driverPhone || 'N/A'}</p>
                <p><span className="font-semibold">Mechanic Name:</span> {bill.car.mechanicName || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Services Performed</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (RWF)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bill.services.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                          No services recorded
                        </td>
                      </tr>
                    ) : (
                      bill.services.map((service) => (
                        <tr key={service.RecordNumber}>
                          <td className="px-4 py-2 text-sm">{service.ServiceDate}</td>
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

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Payments Made</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid (RWF)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bill.payments.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
                          No payments recorded
                        </td>
                      </tr>
                    ) : (
                      bill.payments.map((payment) => (
                        <tr key={payment.PaymentNumber}>
                          <td className="px-4 py-2 text-sm">{payment.PaymentDate}</td>
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

            <div className="mt-6 p-4 bg-gray-100 rounded">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total Service Amount:</span>
                <span className="font-semibold">
                  {parseFloat(bill.totals.totalServiceAmount).toLocaleString('en-RW')} RWF
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total Paid:</span>
                <span className="font-semibold">
                  {parseFloat(bill.totals.totalPaid).toLocaleString('en-RW')} RWF
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-gray-400 pt-2">
                <span>Balance:</span>
                <span>
                  {parseFloat(bill.totals.balance).toLocaleString('en-RW')} RWF
                </span>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>Thank you for your business!</p>
              <p>SmartPark - Rubavu, Rwanda</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
