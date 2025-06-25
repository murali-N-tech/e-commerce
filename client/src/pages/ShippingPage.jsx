// client/src/pages/ShippingPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx'; // For authentication check
import { MapPin, Building, Mail, Flag } from 'lucide-react'; // Icons

const ShippingPage = ({ onNavigate }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Initialize state from localStorage or default values
  const [address, setAddress] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).address : ''
  );
  const [city, setCity] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).city : ''
  );
  const [postalCode, setPostalCode] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).postalCode : ''
  );
  const [country, setCountry] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).country : ''
  );

  const [message, setMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
    }
  }, [isAuthenticated, onNavigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!address || !city || !postalCode || !country) {
      setMessage('Please fill in all shipping details.');
      return;
    }

    const shippingAddress = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));

    setMessage('Shipping details saved successfully!');
    onNavigate('payment'); // Navigate to the payment method selection
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">Shipping Address</h2>

        {message && (
          <div className={`p-4 mb-6 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="City"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Flag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Country"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
