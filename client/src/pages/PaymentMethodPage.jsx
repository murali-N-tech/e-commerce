// client/src/pages/PaymentMethodPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { CreditCard, ArrowLeft, Smartphone, Wallet } from 'lucide-react';

const PaymentMethodPage = ({ onNavigate }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Initialize payment method from localStorage or default
  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod') ? localStorage.getItem('paymentMethod') : 'UPI'
  );
  const [message, setMessage] = useState('');

  // Redirect if not authenticated or if shipping address is missing
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    // Optional: Ensure shipping address is set before allowing payment selection
    if (!localStorage.getItem('shippingAddress')) {
      setMessage('Please provide shipping address first.');
      // You might want to automatically navigate them back:
      onNavigate('shipping');
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!paymentMethod) {
      setMessage('Please select a payment method.');
      return;
    }

    localStorage.setItem('paymentMethod', paymentMethod);
    setMessage('Payment method saved!');
    onNavigate('placeOrder'); // Navigate to the final place order page
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">Payment Method</h2>
        {message && (
          <div className={`p-4 mb-6 rounded-lg text-center ${message.includes('successfully') || message.includes('saved') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input
              type="radio"
              id="upi"
              name="paymentMethod"
              value="UPI"
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="upi" className="ml-3 flex items-center text-lg font-medium text-gray-800">
              <Smartphone size={20} className="mr-2 text-green-500" /> UPI (Google Pay, PhonePe, Paytm)
            </label>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="Card"
              checked={paymentMethod === 'Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="card" className="ml-3 flex items-center text-lg font-medium text-gray-800">
              <CreditCard size={20} className="mr-2 text-blue-500" /> Credit/Debit Card
            </label>
          </div>
          <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="cod" className="ml-3 flex items-center text-lg font-medium text-gray-800">
              <Wallet size={20} className="mr-2 text-orange-500" /> Cash on Delivery (COD)
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue to Place Order
          </button>
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="w-full mt-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
