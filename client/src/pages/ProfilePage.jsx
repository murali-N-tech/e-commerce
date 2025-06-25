import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import authService from '../services/authService.js';
import { User, Mail, Edit, Save, Loader, XCircle, Lock } from 'lucide-react';

const ProfilePage = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      setMessage('');
      try {
        if (user && user.token) {
          const fetchedProfile = await authService.getProfile(user.token);
          setProfile(fetchedProfile);
          setName(fetchedProfile.name);
          setEmail(fetchedProfile.email);
          setPassword('');
          setConfirmPassword('');
        } else {
          setErrorProfile("User token not found. Please log in.");
          logout();
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorProfile(error.message || 'Failed to fetch profile. Please try again.');
        if (error.message.includes('Not authorized') || error.message.includes('Token failed')) {
          logout();
          onNavigate('login');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, logout, onNavigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      console.warn('Form submitted while not in edit mode.');
      return;
    }

    setMessage('');
    setLoadingUpdate(true);

    if (!name || !email) {
      setMessage('Name and Email cannot be empty.');
      setLoadingUpdate(false);
      return;
    }

    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoadingUpdate(false);
      return;
    }

    const noChanges =
      name === profile.name &&
      email === profile.email &&
      (!password || password.length === 0);

    if (noChanges) {
      setMessage('No changes to update.');
      setLoadingUpdate(false);
      return;
    }

    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    try {
      const updatedUser = await authService.updateProfile(updateData, user.token);
      setProfile(updatedUser);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading profile...
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mr-3" /> {errorProfile}
        <button
          onClick={() => onNavigate('login')}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-gray-600 text-xl text-center p-4">
        No profile data available.
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
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 px-2 sm:px-4 py-6 md:py-12">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-md md:max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center">User Profile</h2>

        {message && (
          <div
            className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={isEditing ? handleUpdateProfile : (e) => e.preventDefault()}
          className="space-y-4 sm:space-y-6"
        >
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditing}
              required
            />
          </div>

          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              required
            />
          </div>

          {isEditing && (
            <>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="New Password (optional)"
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit size={20} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                  <span>{loadingUpdate ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) {
                      setName(profile.name);
                      setEmail(profile.email);
                    }
                    setPassword('');
                    setConfirmPassword('');
                    setMessage('');
                  }}
                  className="bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-gray-500 transition-colors duration-200 flex items-center space-x-2"
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="text-red-600 font-semibold hover:underline bg-transparent p-0 border-none focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
