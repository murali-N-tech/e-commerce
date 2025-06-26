import React, { useState, useEffect, useContext } from 'react';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/ShippingPage.jsx',
// then 'AuthContext.jsx' should be located at 'client/src/context/AuthContext.jsx'.
// Double-check the exact file name and case-sensitivity on your file system.
import AuthContext from '../context/AuthContext.jsx';
import { MapPin, Building, Mail, Flag, ArrowLeft } from 'lucide-react'; // Added ArrowLeft icon

const ShippingPage = ({ onNavigate }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Initialize state from localStorage or default values
  // Added a check to ensure parsed data exists before accessing properties
  const getStoredShippingAddress = () => {
    const stored = localStorage.getItem('shippingAddress');
    try {
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Error parsing shipping address from localStorage:", e);
      return {}; // Return empty object if parsing fails
    }
  };

  const storedShippingAddress = getStoredShippingAddress();

  const [address, setAddress] = useState(storedShippingAddress.address || '');
  const [city, setCity] = useState(storedShippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(storedShippingAddress.postalCode || '');
  const [country, setCountry] = useState(storedShippingAddress.country || '');

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
    // Introduce a small delay before navigating to allow message to be seen
    setTimeout(() => {
      onNavigate('payment');
    }, 1000); // 1 second delay
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 px-2 sm:px-4 py-6 md:py-12">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-md md:max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center">Shipping Address</h2>

        {message && (
          <div className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Address"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500"
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
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            {/* Changed Mail icon to a more generic number icon if available, or just keep Mail if it's broadly understood for codes */}
            {/* Using text-gray-400 for icon color for consistency */}
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500"
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
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue to Payment
          </button>
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="w-full mt-4 bg-gray-300 text-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-gray-400 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
