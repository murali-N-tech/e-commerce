import React, { useState, useEffect, useContext } from 'react';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/OrderDetailPage.jsx',
// then 'AuthContext.jsx' should be located at 'client/src/context/AuthContext.jsx'.
// Double-check the exact file name and case-sensitivity on your file system.
import AuthContext from '../context/AuthContext.jsx';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/OrderDetailPage.jsx',
// then 'orderService.js' should be located at 'client/src/services/orderService.js'.
// Double-check the exact file name and case-sensitivity on your file system.
import orderService from '../services/orderService.js';
import {
  Loader,
  XCircle,
  Package, // This icon doesn't seem to be used in the current render logic, but it's imported
  CalendarDays, // This icon doesn't seem to be used in the current render logic, but it's imported
  IndianRupee,
  Truck,
  Eye, // This icon doesn't seem to be used in the current render logic, but it's imported
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
  const [showDeliverConfirmModal, setShowDeliverConfirmModal] = useState(false); // State for deliver confirmation modal

  // Effect hook to fetch order details
  useEffect(() => {
    // Redirect to login if not authenticated after auth loading completes
    if (!authLoading && !isAuthenticated) {
      onNavigate('login');
      return;
    }
    // Handle case where no order ID is provided
    if (!orderId) {
      setErrorOrder('No order ID provided.');
      setLoadingOrder(false);
      return;
    }

    const fetchOrder = async () => {
      setLoadingOrder(true);
      setErrorOrder(null);
      try {
        // Fetch order details only if user and token are available
        if (user && user.token) {
          const fetchedOrder = await orderService.getOrderDetails(orderId, user.token);
          setOrder(fetchedOrder);
        } else {
          // If no user or token, set an error (though redirection should handle this)
          setErrorOrder('Authentication required to fetch order details.');
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setErrorOrder(error.message || 'Failed to fetch order details.');
      } finally {
        setLoadingOrder(false);
      }
    };

    // Trigger fetch when authenticated and not loading auth state
    if (isAuthenticated && !authLoading) {
      fetchOrder();
    }
  }, [orderId, user, isAuthenticated, authLoading, onNavigate]); // Dependencies

  // Function to open the "Mark as Delivered" confirmation modal
  const handleOpenDeliverConfirmModal = () => {
    setShowDeliverConfirmModal(true);
  };

  // Function to close the "Mark as Delivered" confirmation modal
  const handleCloseDeliverConfirmModal = () => {
    setShowDeliverConfirmModal(false);
  };

  // Function to confirm and mark the order as delivered
  const handleConfirmDeliver = async () => {
    handleCloseDeliverConfirmModal(); // Close modal immediately

    try {
      await orderService.deliverOrder(order._id, user.token);
      // Update order state to reflect the delivery status
      setOrder((prev) => ({ ...prev, isDelivered: true, deliveredAt: new Date().toISOString() }));
      setErrorOrder(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to mark as delivered:", err);
      setErrorOrder(err.message || 'Failed to mark as delivered.');
    }
  };

  // Render loading state
  if (loadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading order details...
      </div>
    );
  }

  // Render error state
  if (errorOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mb-3" /> {errorOrder}
        <button
          onClick={() => onNavigate('myOrders')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  // Render "Order not found" state
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-600 text-xl text-center p-4">
        Order not found.
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 sm:mb-12 text-center break-all">
        Order: {order._id}
      </h2>

      {/* Back button for mobile/small screens */}
      <div className="lg:hidden text-center mb-6">
        <button
          onClick={() => onNavigate('myOrders')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-base font-semibold hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Order Details Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-8">
          {/* Shipping Info */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center">
              <Truck size={20} className="mr-2 text-indigo-600" /> Shipping
            </h3>
            <p className="text-gray-700 text-base sm:text-lg">
              Address: {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            {order.isDelivered ? (
              <div className="mt-2 p-2 sm:p-3 bg-green-100 text-green-700 rounded-lg flex items-center text-sm sm:text-base">
                <CheckCircle size={18} className="mr-2" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="mt-2 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
                <XCircle size={18} className="mr-2" /> Not Delivered
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center">
              <CreditCard size={20} className="mr-2 text-indigo-600" /> Payment Method
            </h3>
            <p className="text-gray-700 text-base sm:text-lg">Method: {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="mt-2 p-2 sm:p-3 bg-green-100 text-green-700 rounded-lg flex items-center text-sm sm:text-base">
                <CheckCircle size={18} className="mr-2" /> Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
              </div>
            ) : (
              <div className="mt-2 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
                <XCircle size={18} className="mr-2" /> Not Paid
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 border-b pb-2 flex items-center">
              <ShoppingBag size={20} className="mr-2 text-indigo-600" /> Order Items
            </h3>
            {order.orderItems.length === 0 ? (
              <p className="text-gray-600 text-base sm:text-lg">Order has no items.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm mb-2 sm:mb-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/80x80/E2E8F0/64748B?text=No+Img`;
                      }}
                    />
                    <div className="flex-grow text-center sm:text-left">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                        <button
                          onClick={() => onNavigate('productDetail', item.product)}
                          className="text-indigo-600 hover:underline"
                        >
                          {item.name}
                        </button>
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-md">
                        {item.qty} x ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-base sm:text-lg font-bold text-indigo-700">
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
        {/* Adjusted sticky position and removed fixed top for better mobile scrolling */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:sticky lg:top-32 h-fit mt-6 lg:mt-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 border-b pb-2 sm:pb-4">Order Summary</h3>
          <div className="space-y-3 sm:space-y-4 text-base sm:text-lg">
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
            <div className="flex justify-between text-lg sm:text-2xl font-extrabold text-indigo-700 border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
              <span>Total:</span>
              <span>
                ₹{(order.totalPrice ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment Button */}
          {!order.isPaid && (
            <div className="mt-6 sm:mt-8">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Make Payment</h4>
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
                    setOrder((prev) => ({ ...prev, isPaid: true, paidAt: new Date().toISOString() }));
                    setErrorOrder(null);
                  } catch (err) {
                    console.error("Payment failed:", err);
                    setErrorOrder(err.message || 'Payment failed.');
                  }
                }}
                className="w-full bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <IndianRupee size={20} />
                <span>Confirm Pending Payment</span>
              </button>
            </div>
          )}

          {/* Admin - Mark As Delivered */}
          {user && user.role === 'admin' && !order.isDelivered && order.isPaid && (
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Admin Actions</h4>
              <button
                onClick={handleOpenDeliverConfirmModal} // Use custom modal handler
                className="w-full bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Truck size={20} />
                <span>Mark As Delivered</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Back to My Orders button for larger screens */}
      <div className="hidden lg:block text-center mt-8 sm:mt-12">
        <button
          onClick={() => onNavigate('myOrders')}
          className="bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft size={20} />
          <span>Back to My Orders</span>
        </button>
      </div>

      {/* Deliver Confirmation Modal */}
      {showDeliverConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">Confirm Delivery</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">Are you sure you want to mark this order as delivered?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCloseDeliverConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeliver}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
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

export default OrderDetailPage;
