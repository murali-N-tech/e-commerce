// client/src/pages/AdminDashboard.jsx

import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { Package, Users, ShoppingBag, BarChart2, ChevronRight, Loader } from 'lucide-react';

const AdminDashboard = ({ onNavigate }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      onNavigate('home');
    }
  }, [isAuthenticated, user, loading, onNavigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading admin dashboard...
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        You are not authorized to view this page. Redirecting...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 text-center">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Manage Products Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminProducts')}
        >
          <Package size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Add, edit, or remove products from your store.</p>
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* Manage Users Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminUsers')}
        >
          <Users size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Manage Users</h3>
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">View and manage customer accounts.</p>
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* View Orders Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminOrders')}
        >
          <ShoppingBag size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">View Orders</h3>
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Process and track customer orders.</p>
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* Sales Reports Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminReports')}
        >
          <BarChart2 size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Sales Reports</h3>
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Access business analytics and reports.</p>
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

