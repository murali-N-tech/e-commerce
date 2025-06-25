const API_URL = 'https://e-commerce-slp6.onrender.com/api/users';

const getAllUsers = async (token) => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
};

const deleteUser = async (userId, token) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
};

export default { getAllUsers, deleteUser };
