    // client/src/pages/RegisterPage.jsx

    import React, { useState, useContext, useEffect } from 'react';
    import AuthContext from '../context/AuthContext.jsx'; // ENSURE THIS IS .jsx!
    import { User, Mail, Lock, CheckCircle, Loader } from 'lucide-react'; // Icons

    const RegisterPage = ({ onNavigate }) => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [message, setMessage] = useState(''); // For success or error messages
      const { register, loading, user, isAuthenticated } = useContext(AuthContext); // Get register function and auth status

      // Redirect if already authenticated
      useEffect(() => {
        if (isAuthenticated) {
          onNavigate('home'); // Redirect to home page
        }
      }, [isAuthenticated, onNavigate]);

      const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        if (!name || !email || !password || !confirmPassword) {
          setMessage('Please fill in all fields.');
          return;
        }

        if (password !== confirmPassword) {
          setMessage('Passwords do not match.');
          return;
        }

        try {
          await register(name, email, password);
          setMessage('Registration successful! Redirecting to home...');
          // Redirect handled by useEffect after user state updates
        } catch (error) {
          setMessage(error.message || 'Registration failed. Please try again.');
        }
      };

      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">Register</h2>

            {message && (
              <div className={`p-4 mb-6 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                <span>{loading ? 'Registering...' : 'Register'}</span>
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-indigo-600 font-semibold hover:underline bg-transparent p-0 border-none focus:outline-none"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default RegisterPage;
    