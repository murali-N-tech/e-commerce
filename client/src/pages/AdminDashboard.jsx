// client/src/pages/AdminDashboard.jsx

import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx'; // Import AuthContext
import { Package, Users, ShoppingBag, BarChart2, ChevronRight } from 'lucide-react'; // Icons

const AdminDashboard = ({ onNavigate }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    // Redirect if not authenticated or not an admin after loading
    if (!loading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      onNavigate('home'); // Redirect to home or login page if not authorized
    }
  }, [isAuthenticated, user, loading, onNavigate]);

  // Show loading indicator while authentication status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading admin dashboard...
      </div>
    );
  }

  // If not authenticated or not an admin, we already redirected in useEffect,
  // but a fallback message can be useful in rare cases or during fast redirects.
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        You are not authorized to view this page. Redirecting...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Manage Products Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminProducts')}
        >
          <Package size={64} className="text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-4">Add, edit, or remove products from your store.</p>
          <ChevronRight size={32} className="text-indigo-600" />
        </div>

        {/* Manage Users Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminUsers')}
        >
          <Users size={64} className="text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h3>
          <p className="text-gray-600 mb-4">View and manage customer accounts.</p>
          <ChevronRight size={32} className="text-indigo-600" />
        </div>

        {/* View Orders Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminOrders')}
        >
          <ShoppingBag size={64} className="text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">View Orders</h3>
          <p className="text-gray-600 mb-4">Process and track customer orders.</p>
          <ChevronRight size={32} className="text-indigo-600" />
        </div>

        {/* Sales Reports Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition"
          onClick={() => onNavigate('adminReports')}
        >
          <BarChart2 size={64} className="text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Sales Reports</h3>
          <p className="text-gray-600 mb-4">Access business analytics and reports.</p>
          <ChevronRight size={32} className="text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

