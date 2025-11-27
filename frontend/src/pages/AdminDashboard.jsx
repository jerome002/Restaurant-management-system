import React, { useState, useEffect } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "waiter" });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/users/register", formData, { headers: { Authorization: `Bearer ${token}` } });
      alert(`User ${res.data.data.name} created!`);
      setFormData({ name: "", email: "", password: "", role: "waiter" });
      fetchUsers();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Create User</h2>
      <form onSubmit={createUser}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="chef">Chef</option>
          <option value="waiter">Waiter</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} ({user.email}) - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
