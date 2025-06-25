import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import orderService from '../services/orderService.js';
import { Loader, XCircle, Eye, CheckCircle, Truck } from 'lucide-react';

const AdminOrdersPage = ({ onNavigate }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const data = await orderService.getAllOrders(user.token);
        setOrders(data);
      } catch (err) {
        setErrorOrders(err.message || 'Failed to fetch orders.');
      } finally {
        setLoadingOrders(false);
      }
    };
    if (isAuthenticated && user?.role === 'admin') fetchOrders();
  }, [isAuthenticated, user]);

  const handleMarkDelivered = async (orderId) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await orderService.deliverOrder(orderId, user.token);
        setOrders(orders.map(o => o._id === orderId ? { ...o, isDelivered: true, deliveredAt: new Date() } : o));
      } catch (err) {
        setErrorOrders(err.message || 'Failed to mark as delivered.');
      }
    }
  };

  if (loadingOrders) return <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl"><Loader size={24} className="animate-spin mr-2" /> Loading orders...</div>;
  if (errorOrders) return <div className="text-center text-red-600 text-lg"><XCircle size={24} className="inline-block mr-2" /> {errorOrders}</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">All Orders</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
        <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">ID</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">User</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Date</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Total</th>
              <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase">Paid</th>
              <th className="px-2 sm:px-4 py-2 text-center font-medium text-gray-500 uppercase">Delivered</th>
              <th className="px-2 sm:px-4 py-2 text-right font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id}>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{order._id}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{order.user?.name || 'N/A'}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                  {order.isPaid ? <CheckCircle size={18} className="text-green-600 mx-auto" /> : <XCircle size={18} className="text-red-600 mx-auto" />}
                </td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-center">
                  {order.isDelivered
                    ? <CheckCircle size={18} className="text-green-600 mx-auto" />
                    : <button onClick={() => handleMarkDelivered(order._id)} className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded-full hover:bg-indigo-100 transition-colors" title="Mark as Delivered"><Truck size={16} /></button>
                  }
                </td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right">
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
    </div>
  );
};

export default AdminOrdersPage;
