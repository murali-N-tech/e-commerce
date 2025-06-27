import React, { useEffect, useState, useContext } from 'react';
// IMPORTANT: Please verify this path: client/src/context/AuthContext.jsx
// Ensure the filename and its case match exactly.
import AuthContext from '../context/AuthContext.jsx';
// IMPORTANT: Please verify this path: client/src/services/userService.js
// Ensure the filename and its case match exactly.
import userService from '../services/userService.js';
import { Loader, XCircle, Trash2 } from 'lucide-react';

const ManageUsersPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); // State for delete confirmation modal visibility
  const [userToDeleteId, setUserToDeleteId] = useState(null); // State to hold user ID for deletion confirmation

  // Effect hook to fetch users when component mounts or auth state changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        // Ensure user and token exist before fetching users
        if (user && user.token) {
          const data = await userService.getAllUsers(user.token);
          setUsers(data);
        } else {
          setErrorUsers('Authentication required to fetch users.');
          // In a real application, you might redirect to login/home here
          // For now, it will just show the error message.
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setErrorUsers(err.message || 'Failed to fetch users.');
      } finally {
        setLoadingUsers(false);
      }
    };
    // Fetch users only if authenticated and the user is an admin
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
    } else if (!isAuthenticated && !user) {
      // If not authenticated and user object is null, set error (or redirect if onNavigate prop available)
      setErrorUsers('You are not authorized to view this page. Please log in as an admin.');
    }
  }, [isAuthenticated, user]); // Dependencies for the effect

  // Function to open the delete confirmation modal
  const handleOpenDeleteConfirmModal = (userId) => {
    setUserToDeleteId(userId);
    setShowDeleteConfirmModal(true);
  };

  // Function to close the delete confirmation modal
  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setUserToDeleteId(null);
  };

  // Function to confirm and perform user deletion
  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return; // Should not happen if modal is opened correctly

    handleCloseDeleteConfirmModal(); // Close modal immediately

    try {
      await userService.deleteUser(userToDeleteId, user.token);
      setUsers(users.filter(u => u._id !== userToDeleteId)); // Remove deleted user from state
    } catch (err) {
      console.error("Failed to delete user:", err);
      setErrorUsers(err.message || 'Failed to delete user.');
    }
  };

  // Render loading state
  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl">
        <Loader size={24} className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  // Render error state
  if (errorUsers) {
    return (
      <div className="text-center text-red-600 text-lg p-4">
        <XCircle size={24} className="inline-block mr-2" /> {errorUsers}
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800">Manage Users</h2>
      
      {users.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
          <table className="min-w-[600px] md:min-w-full w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors text-gray-800">
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{u._id}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u.name}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{u.email}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u.role}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {/* Prevent deleting the currently logged-in user */}
                    {user && u._id !== user._id && (
                      <button
                        onClick={() => handleOpenDeleteConfirmModal(u._id)}
                        className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">Confirm User Deletion</h3>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCloseDeleteConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
