import React, { useContext, useEffect } from 'react';
// IMPORTANT: If you are seeing an error like "Could not resolve '../context/AuthContext.jsx'",
// please ensure that the 'AuthContext.jsx' file exists at the correct path:
// client/src/context/AuthContext.jsx relative to client/src/pages/AdminDashboard.jsx
// Also, check for any case sensitivity issues in the file or directory names.
import AuthContext from '../context/AuthContext.jsx';
import { Package, Users, ShoppingBag, BarChart2, ChevronRight, Loader } from 'lucide-react';

// AdminDashboard functional component
const AdminDashboard = ({ onNavigate }) => {
  // Access user authentication state from AuthContext
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Effect hook to handle authorization and navigation
  // Redirects to 'home' if not authenticated or if the user is not an admin
  useEffect(() => {
    // Only run this check after loading is complete
    if (!loading) {
      if (!isAuthenticated || (user && user.role !== 'admin')) {
        // If not authorized, navigate to the home page
        onNavigate('home');
      }
    }
  }, [isAuthenticated, user, loading, onNavigate]); // Dependencies for the effect

  // Display a loading indicator while authentication status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> {/* Lucide icon for loading spinner */}
        Loading admin dashboard...
      </div>
    );
  }

  // Display an unauthorized message and trigger redirection if not an admin
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        You are not authorized to view this page. Redirecting...
      </div>
    );
  }

  // Render the Admin Dashboard UI once authorized
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      {/* Dashboard Title - Responsive text sizing */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 text-center">
        Admin Dashboard
      </h2>

      {/* Grid for Dashboard Cards - Responsive columns and gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Manage Products Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
          onClick={() => onNavigate('adminProducts')}
        >
          {/* Lucide icon for Package - Responsive size */}
          <Package size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          {/* Card Title - Responsive text sizing */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Manage Products</h3>
          {/* Card Description - Responsive text sizing */}
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Add, edit, or remove products from your store.</p>
          {/* ChevronRight icon for navigation indication - Responsive size */}
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* Manage Users Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
          onClick={() => onNavigate('adminUsers')}
        >
          {/* Lucide icon for Users - Responsive size */}
          <Users size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          {/* Card Title - Responsive text sizing */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Manage Users</h3>
          {/* Card Description - Responsive text sizing */}
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">View and manage customer accounts.</p>
          {/* ChevronRight icon for navigation indication - Responsive size */}
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* View Orders Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
          onClick={() => onNavigate('adminOrders')}
        >
          {/* Lucide icon for ShoppingBag - Responsive size */}
          <ShoppingBag size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          {/* Card Title - Responsive text sizing */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">View Orders</h3>
          {/* Card Description - Responsive text sizing */}
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Process and track customer orders.</p>
          {/* ChevronRight icon for navigation indication - Responsive size */}
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>

        {/* Sales Reports Card */}
        <div
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
          onClick={() => onNavigate('adminReports')}
        >
          {/* Lucide icon for BarChart2 - Responsive size */}
          <BarChart2 size={48} className="sm:size-56 md:size-64 text-indigo-600 mb-2 sm:mb-4" />
          {/* Card Title - Responsive text sizing */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Sales Reports</h3>
          {/* Card Description - Responsive text sizing */}
          <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">Access business analytics and reports.</p>
          {/* ChevronRight icon for navigation indication - Responsive size */}
          <ChevronRight size={24} className="sm:size-32 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
