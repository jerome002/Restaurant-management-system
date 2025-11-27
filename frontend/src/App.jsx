import React, { useState } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import POS from "./pages/POS";

const App = () => {
  const [user, setUser] = useState(null); // Store logged-in user info

  if (!user) return <Login setUser={setUser} />;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      {/* Show Admin Dashboard only for admin */}
      {user.role === "admin" && <AdminDashboard />}

      {/* POS for cashier, waiter */}
      {(user.role === "cashier" || user.role === "waiter") && <POS />}

      {/* Chef view could be another page for queued orders */}
    </div>
  );
};

export default App;
