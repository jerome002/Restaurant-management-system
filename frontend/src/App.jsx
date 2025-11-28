import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import POS from "./pages/POS";

const App = () => {
  // Initialize user from localStorage if already logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // If user is not logged in, show Login page
  if (!user) return <Login setUser={setUser} />;

  return (
    <Router>
      <Routes>
        {/* Admin Dashboard only for admin */}
        {user.role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}

        {/* POS page for cashier/waiter */}
        {(user.role === "cashier" || user.role === "waiter") && (
          <Route path="/pos" element={<POS />} />
        )}

        {/* Default route depending on user role */}
        <Route
          path="*"
          element={
            <Navigate
              to={user.role === "admin" ? "/admin" : "/pos"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

