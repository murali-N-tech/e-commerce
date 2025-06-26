import React, { useEffect, useState, useContext } from 'react';
// IMPORTANT: Please verify these import paths.
// If 'AuthContext.jsx' is located at 'client/src/context/AuthContext.jsx',
// and this component is at 'client/src/pages/AdminOrdersPage.jsx', then '../context/AuthContext.jsx' is correct.
// Double-check the exact file name and case-sensitivity.
import AuthContext from '../context/AuthContext.jsx';
// IMPORTANT: Please verify this import path.
// If 'orderService.js' is located at 'client/src/services/orderService.js',
// and this component is at 'client/src/pages/AdminOrdersPage.jsx', then '../services/orderService.js' is correct.
// Double-check the exact file name and case-sensitivity.
import orderService from '../services/orderService.js';
import { Loader, XCircle, Eye, CheckCircle, Truck } from 'lucide-react';

const AdminOrdersPage = ({ onNavigate }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility
  const [orderToDeliverId, setOrderToDeliverId] = useState(null); // State to hold order ID for confirmation

  // Effect hook to fetch orders when component mounts or auth state changes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        // Ensure user and token exist before fetching orders
        if (user && user.token) {
          const data = await orderService.getAllOrders(user.token);
          setOrders(data);
        } else {
          // If no user or token, set an error or redirect
          setErrorOrders('Authentication required to fetch orders.');
          onNavigate('home'); // Optionally redirect if not authorized
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setErrorOrders(err.message || 'Failed to fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };
    // Fetch orders only if authenticated and the user is an admin
    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    } else if (!isAuthenticated && !user) {
      // If not authenticated and user object is null, redirect to home
      onNavigate('home');
    }
  }, [isAuthenticated, user, onNavigate]); // Dependencies for the effect

  // Function to handle opening the confirmation modal
  const handleOpenConfirmModal = (orderId) => {
    setOrderToDeliverId(orderId);
    setShowConfirmModal(true);
  };

  // Function to handle closing the confirmation modal
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setOrderToDeliverId(null);
  };

  // Function to confirm and mark an order as delivered
  const handleConfirmDeliver = async () => {
    if (!orderToDeliverId) return; // Should not happen if modal is opened correctly

    handleCloseConfirmModal(); // Close modal immediately

    try {
      await orderService.deliverOrder(orderToDeliverId, user.token);
      setOrders(orders.map(o => o._id === orderToDeliverId ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o));
    } catch (err) {
      console.error("Failed to mark as delivered:", err);
      setErrorOrders(err.message || 'Failed to mark as delivered.');
    }
  };

  // Render loading state
  if (loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl">
        <Loader size={24} className="animate-spin mr-2" /> Loading orders...
      </div>
    );
  }

  // Render error state
  if (errorOrders) {
    return (
      <div className="text-center text-red-600 text-lg p-4">
        <XCircle size={24} className="inline-block mr-2" /> {errorOrders}
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800">All Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No orders found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <table className="min-w-[700px] md:min-w-full w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{order._id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{order.user?.name || 'N/A'}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                    {order.isPaid ? <CheckCircle size={18} className="text-green-600 mx-auto" /> : <XCircle size={18} className="text-red-600 mx-auto" />}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                    {order.isDelivered
                      ? <CheckCircle size={18} className="text-green-600 mx-auto" />
                      : (
                        <button
                          onClick={() => handleOpenConfirmModal(order._id)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-full hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                          title="Mark as Delivered"
                        >
                          <Truck size={16} />
                        </button>
                      )
                    }
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right">
                    <button
                      onClick={() => onNavigate('orderDetail', order._id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-full hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      title="View Order Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">Confirm Delivery</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">Are you sure you want to mark this order as delivered?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCloseConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeliver}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
