// client/src/pages/PlaceOrderPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx'; // Import CartContext
import orderService from '../services/orderService.js'; // Import orderService
import { CheckCircle, XCircle, ArrowLeft, Loader, CreditCard, MapPin, ShoppingBag, Edit } from 'lucide-react'; // Icons

const PlaceOrderPage = ({ onNavigate }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext); // Get cart items and clearCart

  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [message, setMessage] = useState('');
  const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null); // To store the created order ID/details

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2)); // 8% tax
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    // Load shipping address and payment method from localStorage
    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');

    if (storedShippingAddress) {
      setShippingAddress(JSON.parse(storedShippingAddress));
    } else {
      setMessage('Shipping address not found. Please go back to cart to fill it.');
      onNavigate('shipping'); // Redirect if shipping info is missing
      return;
    }

    if (storedPaymentMethod) {
      setPaymentMethod(storedPaymentMethod);
    } else {
      setMessage('Payment method not found. Please go back to payment selection.');
      onNavigate('payment'); // Redirect if payment method is missing
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Your cart is empty. Please add items to place an order.');
      onNavigate('cart'); // Redirect if cart is empty
      return;
    }

  }, [isAuthenticated, onNavigate, cartItems.length]); // Depend on cartItems.length to re-evaluate if cart changes

  const placeOrderHandler = async () => {
    if (!shippingAddress || !paymentMethod || cartItems.length === 0) {
      setMessage('Missing order details. Please review your cart, shipping, and payment.');
      return;
    }

    setLoadingPlaceOrder(true);
    setMessage('');
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id, // Send the actual product ID (from MongoDB)
          name: item.name,
          qty: item.quantity,
          image: item.imageUrl,
          price: item.price,
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice, // Include these for backend verification/storage
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      };

      const createdOrder = await orderService.createOrder(orderData, user.token);
      setOrderCreated(createdOrder); // Store the created order for success message/link
      setMessage('Order placed successfully!');
      clearCart(); // Clear cart after successful order
      localStorage.removeItem('shippingAddress'); // Clear shipping info
      localStorage.removeItem('paymentMethod');   // Clear payment method

      // Redirect to a success page or order details page after a short delay
      setTimeout(() => {
        onNavigate('orderDetail', createdOrder._id); // Navigate to order detail page
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      setMessage(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoadingPlaceOrder(false);
    }
  };

  if (!shippingAddress || !paymentMethod || cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mr-3" />
        {message || 'Redirecting to complete order details...'}
        <button
          onClick={() => onNavigate('cart')}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Place Order</h2>

      {message && (
        <div className={`p-4 mb-6 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
          {orderCreated && message.includes('successfully') && (
            <p className="mt-2">
              <button
                onClick={() => onNavigate('orderDetail', orderCreated._id)}
                className="text-indigo-700 underline hover:no-underline"
              >
                View Order {orderCreated._id}
              </button>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Shipping Info */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <MapPin size={24} className="mr-2 text-indigo-600" /> Shipping
            </h3>
            <p className="text-gray-700 text-lg">
              Address: {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <button
              onClick={() => onNavigate('shipping')}
              className="mt-3 text-indigo-600 hover:underline text-sm flex items-center"
            >
              <Edit size={16} className="mr-1" /> Edit Shipping Address
            </button>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <CreditCard size={24} className="mr-2 text-indigo-600" /> Payment Method
            </h3>
            <p className="text-gray-700 text-lg">Method: {paymentMethod}</p>
            <button
              onClick={() => onNavigate('payment')}
              className="mt-3 text-indigo-600 hover:underline text-sm flex items-center"
            >
              <Edit size={16} className="mr-1" /> Edit Payment Method
            </button>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-3 flex items-center">
              <ShoppingBag size={24} className="mr-2 text-indigo-600" /> Order Items
            </h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600 text-lg">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/E2E8F0/64748B?text=No+Img`; }}
                    />
                    <div className="flex-grow">
                      <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-gray-600 text-md">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-lg font-bold text-indigo-700">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary / Place Order Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 sticky top-32 h-fit">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h3>
          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-semibold">₹{itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-semibold">₹{shippingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span className="font-semibold">₹{taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-2xl font-extrabold text-indigo-700 border-t pt-4 mt-4">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <button
            onClick={placeOrderHandler}
            className="mt-8 w-full bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingPlaceOrder || cartItems.length === 0 || !shippingAddress || !paymentMethod}
          >
            {loadingPlaceOrder ? <Loader size={24} className="animate-spin mr-2" /> : <CheckCircle size={24} />}
            <span>{loadingPlaceOrder ? 'Placing Order...' : 'Place Order'}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('payment')}
            className="w-full mt-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
