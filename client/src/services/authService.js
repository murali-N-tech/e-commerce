// client/src/services/authService.js

const API_URL = 'http://localhost:5000/api/users/'; // Base URL for user authentication endpoints

/**
 * Registers a new user.
 * @param {object} userData - User data containing name, email, and password.
 * @returns {Promise<object>} - User data including token if successful.
 */
const register = async (userData) => {
  try {
    const response = await fetch(API_URL + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the server responded with an error status (e.g., 400, 500)
      throw new Error(data.message || 'Registration failed');
    }

    // If registration is successful, store the user token in local storage
    if (data.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data; // Return user info and token
  } catch (error) {
    console.error('Registration API Error:', error);
    throw error; // Re-throw to be caught by the component
  }
};

/**
 * Logs in an existing user.
 * @param {object} userData - User data containing email and password.
 * @returns {Promise<object>} - User data including token if successful.
 */
const login = async (userData) => {
  try {
    const response = await fetch(API_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // If login is successful, store the user token in local storage
    if (data.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data; // Return user info and token
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

/**
 * Logs out the current user by removing user info from local storage.
 */
const logout = () => {
  localStorage.removeItem('userInfo');
};

/**
 * Gets the user profile from the backend.
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} - User profile data.
 */
const getProfile = async (token) => {
  try {
    const response = await fetch(API_URL + 'profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the JWT in the Authorization header
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Get Profile API Error:', error);
    throw error;
  }
};

/**
 * Updates the user profile on the backend.
 * @param {object} profileData - Data to update (e.g., { name, email, password }).
 * @param {string} token - The user's JWT.
 * @returns {Promise<object>} - Updated user profile data.
 */
const updateProfile = async (profileData, token) => {
  try {
    const response = await fetch(API_URL + 'profile', {
      method: 'PUT', // Use PUT for updates
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the JWT
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // If profile update is successful, update user info in local storage
    // This is important if name/email changes affect displayed info
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updatedUserInfo = { ...userInfo, ...data }; // Merge current with updated profile
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

    return updatedUserInfo; // Return updated user info
  } catch (error) {
    console.error('Update Profile API Error:', error);
    throw error;
  }
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile, // Add the new function to the exported object
};

export default authService;
