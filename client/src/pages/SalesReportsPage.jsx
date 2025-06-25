import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import orderService from '../services/orderService.js';
import userService from '../services/userService.js';
import { Loader, XCircle, BarChart2 } from 'lucide-react';

const SalesReportsPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const [orders, users] = await Promise.all([
          orderService.getAllOrders(user.token),
          userService.getAllUsers(user.token),
        ]);
        const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setStats({
          totalOrders: orders.length,
          totalSales,
          totalUsers: users.length,
        });
      } catch (err) {
        setErrorStats(err.message || 'Failed to fetch sales stats.');
      } finally {
        setLoadingStats(false);
      }
    };
    if (isAuthenticated && user?.role === 'admin') fetchStats();
  }, [isAuthenticated, user]);

  if (loadingStats)
    return (
      <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl">
        <Loader size={24} className="animate-spin mr-2" /> Loading reports...
      </div>
    );
  if (errorStats)
    return (
      <div className="text-center text-red-600 text-lg">
        <XCircle size={24} className="inline-block mr-2" /> {errorStats}
      </div>
    );

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center">
        <BarChart2 className="mr-3" /> Sales Reports
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
          <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-2">Total Sales</h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            ₹{stats.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
          <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-2">Total Orders</h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
          <h3 className="text-lg sm:text-2xl font-bold text-indigo-700 mb-2">Total Users</h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesReportsPage;

