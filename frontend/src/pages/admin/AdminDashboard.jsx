import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const token = localStorage.getItem("adminToken");

  const [dashboard, setDashboard] = useState({
    totalCustomers: 0,
    totalOwners: 0,
    totalRestaurants: 0,
    totalFoods: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await API.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Admin dashboard load failed");
      }
    }

    loadDashboard();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <h2>
          Crave<span>Run</span>
        </h2>

        <Link to="/admin/dashboard">📊 Dashboard</Link>
        <Link to="/admin/customers">👥 Customers</Link>
        <Link to="/admin/owners">🏪 Owners</Link>
        <Link to="/admin/restaurants">🍽️ Restaurants</Link>
        <Link to="/admin/orders">📦 Orders</Link>

        <button onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Admin Dashboard</h1>
          <p>Manage the full CraveRun platform</p>
        </div>

        <div className="admin-cards">
          <div className="admin-card">
            <span>👥</span>
            <h3>{dashboard.totalCustomers}</h3>
            <p>Customers</p>
          </div>

          <div className="admin-card">
            <span>🏪</span>
            <h3>{dashboard.totalOwners}</h3>
            <p>Owners</p>
          </div>

          <div className="admin-card">
            <span>🍽️</span>
            <h3>{dashboard.totalRestaurants}</h3>
            <p>Restaurants</p>
          </div>

          <div className="admin-card">
            <span>🍔</span>
            <h3>{dashboard.totalFoods}</h3>
            <p>Foods</p>
          </div>

          <div className="admin-card">
            <span>📦</span>
            <h3>{dashboard.totalOrders}</h3>
            <p>Orders</p>
          </div>

          <div className="admin-card">
            <span>💰</span>
            <h3>₹{dashboard.totalRevenue}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;