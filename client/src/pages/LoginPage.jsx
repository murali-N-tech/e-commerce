// client/src/pages/LoginPage.jsx

import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';

const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, loading, user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('home');
    }
  }, [isAuthenticated, onNavigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }
    try {
      await login(email, password);
      setMessage('Login successful! Redirecting...');
    } catch (error) {
      setMessage(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 px-2 sm:px-4 py-6 md:py-12">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-md md:max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center">Login</h2>

        {message && (
          <div className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <ArrowRight size={20} />}
            <span>{loading ? 'Logging In...' : 'Login'}</span>
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center text-gray-600 text-sm sm:text-base">
          New Customer?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 font-semibold hover:underline bg-transparent p-0 border-none focus:outline-none"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
