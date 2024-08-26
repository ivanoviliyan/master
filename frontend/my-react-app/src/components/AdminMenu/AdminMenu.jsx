import React, { useState, useEffect } from 'react';
import './AdminMenu.css'; // Ensure this file contains the updated CSS
import { Footer } from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include JWT token
          },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const result = await response.json();
        setUsers(result.data); // Adjust according to API response structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include JWT token
        },
      });

      if (!response.ok) throw new Error('Failed to update user');

      const result = await response.json();

      // Update the user list after successful update
      setUsers(users.map(user =>
        user._id === userId ? { ...user, isAdmin: result.isAdmin } : user
      ));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleBackBtn = () => {
    navigate(-1);
  }

  return (
    <>
      <div className="admin-menu">
        <div className="conter">
          <button onClick={handleBackBtn}>Back</button>
          <h1>Admin Menu</h1>
        </div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-box"
        />
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Is Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                    >
                      Toggle Admin
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer /></>
  );
};

export default AdminMenu;
