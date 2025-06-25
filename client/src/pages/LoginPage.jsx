import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';
import userService from '../services/userService.js';
import { Loader, XCircle, Trash2 } from 'lucide-react';

const ManageUsersPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const data = await userService.getAllUsers(user.token);
        setUsers(data);
      } catch (err) {
        setErrorUsers(err.message || 'Failed to fetch users.');
      } finally {
        setLoadingUsers(false);
      }
    };
    if (isAuthenticated && user?.role === 'admin') fetchUsers();
  }, [isAuthenticated, user]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId, user.token);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        setErrorUsers(err.message || 'Failed to delete user.');
      }
    }
  };

  if (loadingUsers) return <div className="flex items-center justify-center min-h-[200px] text-indigo-700 text-xl"><Loader size={24} className="animate-spin mr-2" /> Loading users...</div>;
  if (errorUsers) return <div className="text-center text-red-600 text-lg"><XCircle size={24} className="inline-block mr-2" /> {errorUsers}</div>;

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">Manage Users</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-2 sm:p-4">
        <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">ID</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Name</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Email</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Role</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u._id}>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u._id}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u.name}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u.email}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{u.role}</td>
                <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                  {u._id !== user._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors"
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
    </div>
  );
};

export default ManageUsersPage;
