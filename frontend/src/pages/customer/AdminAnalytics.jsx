import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminAnalytics.css";

function AdminAnalytics() {
  const token = localStorage.getItem("adminToken");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load analytics");
      }
    }

    loadOrders();
  }, [token]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus !== "Delivered"
  ).length;

  return (
    <div className="admin-analytics-page">
      <h1>Analytics & Revenue</h1>

      <div className="analytics-cards">
        <div className="analytics-card">
          <span>📦</span>
          <h2>{totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div className="analytics-card">
          <span>💰</span>
          <h2>₹{totalRevenue}</h2>
          <p>Total Revenue</p>
        </div>

        <div className="analytics-card">
          <span>✅</span>
          <h2>{deliveredOrders}</h2>
          <p>Delivered</p>
        </div>

        <div className="analytics-card">
          <span>⏳</span>
          <h2>{pendingOrders}</h2>
          <p>Pending</p>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;