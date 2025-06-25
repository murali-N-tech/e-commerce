// client/src/pages/OrderDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import orderService from '../services/orderService.js';
import {
  Loader,
  XCircle,
  Package,
  CalendarDays,
  IndianRupee,
  Truck,
  Eye,
  CheckCircle,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

const OrderDetailPage = ({ orderId, onNavigate }) => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [errorOrder, setErrorOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      onNavigate('login');
      return;
    }
    if (!orderId) {
      setErrorOrder('No order ID provided.');
      setLoadingOrder(false);
      return;
    }

    const fetchOrder = async () => {
      setLoadingOrder(true);
      setErrorOrder(null);
      try {
        if (user && user.token) {
          const fetchedOrder = await orderService.getOrderDetails(orderId, user.token);
          setOrder(fetchedOrder);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setErrorOrder(error.message || 'Failed to fetch order details.');
      } finally {
        setLoadingOrder(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchOrder();
    }
  }, [orderId, user, isAuthenticated, authLoading, onNavigate]);

  if (loadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading order details...
      </div>
    );
  }

  if (errorOrder) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mr-3" /> {errorOrder}
        <button
          onClick={() => onNavigate('myOrders')}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-gray-600 text-xl text-center p-4">
        Order not found.
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
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Order: {order._id}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Shipping Info */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <Truck size={24} className="mr-2 text-indigo-600" /> Shipping
            </h3>
            <p className="text-gray-700 text-lg">
              Address: {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            {order.isDelivered ? (
              <div className="mt-2 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                <CheckCircle size={20} className="mr-2" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <XCircle size={20} className="mr-2" /> Not Delivered
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <CreditCard size={24} className="mr-2 text-indigo-600" /> Payment Method
            </h3>
            <p className="text-gray-700 text-lg">Method: {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="mt-2 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                <CheckCircle size={20} className="mr-2" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <XCircle size={20} className="mr-2" /> Not Paid
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <ShoppingBag size={24} className="mr-2 text-indigo-600" /> Order Items
            </h3>
            {order.orderItems.length === 0 ? (
              <p className="text-gray-600 text-lg">Order has no items.</p>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/80x80/E2E8F0/64748B?text=No+Img`;
                      }}
                    />
                    <div className="flex-grow">
                      <h4 className="text-xl font-semibold text-gray-800">
                        <button
                          onClick={() => onNavigate('productDetail', item.product)}
                          className="text-indigo-600 hover:underline"
                        >
                          {item.name}
                        </button>
                      </h4>
                      <p className="text-gray-600 text-md">
                        {item.qty} x ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-lg font-bold text-indigo-700">
                        ₹{(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 sticky top-32 h-fit">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-semibold">
                ₹{(order.itemsPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-semibold">
                ₹{(order.shippingPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span className="font-semibold">
                ₹{(order.taxPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold text-indigo-700 border-t pt-4 mt-4">
              <span>Total:</span>
              <span>
                ₹{(order.totalPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          {!order.isPaid && (
            <div className="mt-8">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Make Payment</h4>
              <button
                onClick={async () => {
                  try {
                    await orderService.payOrder(
                      order._id,
                      {
                        id: `PAY-${Date.now()}`,
                        status: 'COMPLETED',
                        update_time: new Date().toISOString(),
                        email_address: user.email,
                      },
                      user.token
                    );
                    setOrder((prev) => ({ ...prev, isPaid: true, paidAt: new Date() }));
                    setErrorOrder(null);
                  } catch (err) {
                    setErrorOrder(err.message || 'Payment failed.');
                    console.error('Payment error:', err);
                  }
                }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <IndianRupee size={20} />
                <span>Confirm Pending Payment</span>
              </button>
            </div>
          )}

          {/* Admin - Mark As Delivered */}
          {user && user.role === 'admin' && !order.isDelivered && order.isPaid && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Admin Actions</h4>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to mark this order as Delivered?')) {
                    try {
                      await orderService.deliverOrder(order._id, user.token);
                      setOrder((prev) => ({ ...prev, isDelivered: true, deliveredAt: new Date() }));
                      setErrorOrder(null);
                    } catch (err) {
                      setErrorOrder(err.message || 'Failed to mark as delivered.');
                      console.error('Delivery update error:', err);
                    }
                  }
                }}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Truck size={20} />
                <span>Mark As Delivered</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => onNavigate('myOrders')}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={20} />
          <span>Back to My Orders</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
