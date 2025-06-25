const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAllUsers = async (token) => {
  const res = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

const deleteUser = async (userId, token) => {
  const res = await fetch(`${API}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
};

export default { getAllUsers, deleteUser };