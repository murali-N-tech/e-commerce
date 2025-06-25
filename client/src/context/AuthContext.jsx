// client/src/context/AuthContext.jsx

    import React, { createContext, useState, useEffect } from 'react';
    import authService from '../services/authService.js'; // ENSURE THIS IS .js!
    // Create the AuthContext
    const AuthContext = createContext();

    // Create the AuthProvider component
    export const AuthProvider = ({ children }) => {
      // Initialize user state from localStorage (if user was previously logged in)
      const [user, setUser] = useState(() => {
        try {
          const userInfo = localStorage.getItem('userInfo');
          return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
          console.error("Error parsing user info from localStorage:", error);
          return null;
        }
      });
      const [loading, setLoading] = useState(true); // Loading state for initial auth check

      // Effect to check user's token validity on app load
      // In a real app, you might decode the JWT here to check expiry, or
      // make a quick API call to a protected route to validate the token.
      useEffect(() => {
        const checkUser = async () => {
          if (user && user.token) {
            try {
              // Attempt to fetch profile to validate token with backend
              await authService.getProfile(user.token);
              // If successful, user is valid
            } catch (error) {
              console.error('Token validation failed:', error);
              // If validation fails (e.g., token expired/invalid), log out user
              authService.logout();
              setUser(null);
            }
          }
          setLoading(false); // Set loading to false after initial check
        };

        checkUser();
      }, [user]); // Re-run if user object changes

      // Login function
      const login = async (email, password) => {
        try {
          setLoading(true);
          const userData = await authService.login({ email, password });
          setUser(userData); // Update user state with returned data (including token)
          setLoading(false);
          return userData;
        } catch (error) {
          setLoading(false);
          throw error; // Re-throw to be handled by UI components
        }
      };

      // Register function
      const register = async (name, email, password) => {
        try {
          setLoading(true);
          const userData = await authService.register({ name, email, password });
          setUser(userData); // Update user state
          setLoading(false);
          return userData;
        } catch (error) {
          setLoading(false);
          throw error;
        }
      };

      // Logout function
      const logout = () => {
        authService.logout(); // Remove from localStorage
        setUser(null);      // Clear user state
      };

      // Context value provided to children components
      const authContextValue = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!user.token, // Convenience getter
      };

      return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      );
    };

    export default AuthContext;
