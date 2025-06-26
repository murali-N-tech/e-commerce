import React, { useState, useEffect, useContext } from 'react';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/ProfilePage.jsx',
// then 'AuthContext.jsx' should be located at 'client/src/context/AuthContext.jsx'.
// Double-check the exact file name and case-sensitivity on your file system.
import AuthContext from '../context/AuthContext.jsx';
// IMPORTANT: Please verify this path. If this component is at 'client/src/pages/ProfilePage.jsx',
// then 'authService.js' should be located at 'client/src/services/authService.js'.
// Double-check the exact file name and case-sensitivity on your file system.
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
    // Redirect to login if user is not authenticated
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      setMessage(''); // Clear previous messages
      try {
        // Ensure user and token exist before fetching profile
        if (user && user.token) {
          const fetchedProfile = await authService.getProfile(user.token);
          setProfile(fetchedProfile);
          setName(fetchedProfile.name);
          setEmail(fetchedProfile.email);
          setPassword(''); // Clear password fields on profile load/refresh
          setConfirmPassword('');
        } else {
          // If user token is missing, log out and redirect to login
          setErrorProfile("User token not found. Please log in.");
          logout();
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorProfile(error.message || 'Failed to fetch profile. Please try again.');
        // If authorization fails (e.g., token expired), log out and redirect
        if (error.message.includes('Not authorized') || error.message.includes('Token failed')) {
          logout();
          onNavigate('login');
        }
      } finally {
        setLoadingProfile(false); // Set loading to false regardless of success/failure
      }
    };

    fetchProfile(); // Call fetchProfile when the component mounts or dependencies change
  }, [isAuthenticated, user, logout, onNavigate]); // Dependencies for useEffect

  // Handler for updating the user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Prevent submission if not in editing mode (should be handled by button visibility)
    if (!isEditing) {
      console.warn('Form submitted while not in edit mode.');
      return;
    }

    setMessage(''); // Clear previous messages
    setLoadingUpdate(true); // Set loading state for update operation

    // Basic client-side validation
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

    // Check if there are any actual changes before sending update request
    const noChanges =
      name === profile.name &&
      email === profile.email &&
      (!password || password.length === 0); // Check if password field is empty if not changing

    if (noChanges) {
      setMessage('No changes to update.');
      setLoadingUpdate(false);
      return;
    }

    // Prepare update data payload
    const updateData = { name, email };
    if (password) { // Only include password in updateData if a new one is provided
      updateData.password = password;
    }

    try {
      // Call authService to update the profile
      const updatedUser = await authService.updateProfile(updateData, user.token);
      setProfile(updatedUser); // Update local profile state with the new data
      setMessage('Profile updated successfully!');
      setIsEditing(false); // Exit editing mode
      setPassword(''); // Clear password fields
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating user profile:', error);
      setMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoadingUpdate(false); // Reset loading state
    }
  };

  // Render loading state for profile fetch
  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-indigo-700 text-2xl">
        <Loader size={30} className="animate-spin mr-3" /> Loading profile...
      </div>
    );
  }

  // Render error state for profile fetch
  if (errorProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-xl text-center p-4">
        <XCircle size={30} className="mb-3" /> {errorProfile}
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Render case where profile data is unexpectedly null after loading
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-gray-600 text-xl text-center p-4">
        No profile data available.
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 px-2 sm:px-4 py-6 md:py-12">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 md:p-10 w-full max-w-xs sm:max-w-md md:max-w-lg transform transition-all duration-300 hover:scale-[1.01]">
        {/* Page Title - Responsive text sizing */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center">User Profile</h2>

        {/* Message/Alert Area */}
        {message && (
          <div
            className={`p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Form */}
        <form
          // Only enable form submission if in editing mode
          onSubmit={isEditing ? handleUpdateProfile : (e) => e.preventDefault()}
          className="space-y-4 sm:space-y-6"
        >
          {/* Name Input */}
          <div className="relative">
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditing} // Make read-only if not editing
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing} // Make read-only if not editing
              required
            />
          </div>

          {/* Password Fields (only visible/editable in editing mode) */}
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
                  autoComplete="new-password" // Helps browsers suggest strong passwords
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

          {/* Action Buttons (Edit/Save/Cancel) - responsive stacking/alignment */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6"> {/* Added mt-6 for spacing */}
            {!isEditing ? (
              <button
                type="button" // Use type="button" to prevent accidental form submission
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <Edit size={20} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                  <span>{loadingUpdate ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button" // Use type="button" to prevent accidental form submission
                  onClick={() => {
                    setIsEditing(false); // Exit editing mode
                    // Revert form fields to current profile data
                    if (profile) {
                      setName(profile.name);
                      setEmail(profile.email);
                    }
                    setPassword(''); // Clear password fields on cancel
                    setConfirmPassword('');
                    setMessage(''); // Clear any messages
                  }}
                  className="w-full sm:w-auto bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <XCircle size={20} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </form>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="text-red-600 font-semibold hover:underline bg-transparent p-0 border-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
