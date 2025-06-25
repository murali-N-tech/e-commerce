// client/src/pages/OrderHistoryPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import orderService from '../services/orderService.js';
import { Loader, XCircle, Package, Eye, CheckCircle } from 'lucide-react';

const OrderHistoryPage = ({ onNavigate }) => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      onNavigate('login');
      return;
    }

    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        if (user && user.token) {
          // Fetch all orders for admin, or only user's orders for regular user
          const fetchedOrders = user.role === 'admin'
            ? await orderService.getAllOrders(user.token)
            : await orderService.getMyOrders(user.token);
          setOrders(fetchedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorOrders(error.message || 'Failed to fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, user, authLoading, onNavigate]);

  if (loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading orders...
      </div>
    );
  }

  if (errorOrders) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mr-3" /> {errorOrders}
        <button
          onClick={() => onNavigate('home')}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 sm:mb-12 text-center">
        {user && user.role === 'admin' ? 'All Orders' : 'My Orders'}
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-10 text-center flex flex-col items-center">
          <Package size={60} className="text-gray-400 mb-4 sm:mb-6" />
          <p className="text-gray-600 text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">
            {user && user.role === 'admin' ? 'No orders found.' : 'You have not placed any orders yet.'}
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">ID</th>
                {user && user.role === 'admin' && (
                  <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">User</th>
                )}
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Total</th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase">Delivered</th>
                <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-900 truncate w-32">{order._id}</td>
                  {user && user.role === 'admin' && (
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-700">
                      {order.user ? order.user.name : 'N/A'}
                    </td>
                  )}
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-gray-500">
                    ₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                    {order.isPaid ? (
                      <CheckCircle size={18} className="text-green-600 mx-auto" title={`Paid on ${new Date(order.paidAt).toLocaleDateString()}`} />
                    ) : (
                      <XCircle size={18} className="text-red-600 mx-auto" title="Not Paid" />
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                    {order.isDelivered ? (
                      <CheckCircle size={18} className="text-green-600 mx-auto" title={`Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`} />
                    ) : (
                      <XCircle size={18} className="text-red-600 mx-auto" title="Not Delivered" />
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right font-medium">
                    <button
                      onClick={() => onNavigate('orderDetail', order._id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-full hover:bg-indigo-100 transition-colors"
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
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('home')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
