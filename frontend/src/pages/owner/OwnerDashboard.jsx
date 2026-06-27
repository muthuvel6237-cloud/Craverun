import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./OwnerDashboard.css";

const COMMISSION_RATE = 10;

function money(value) {
  return `Rs ${Math.round(Number(value) || 0)}`;
}

function OwnerDashboard() {
  const token = localStorage.getItem("ownerToken");
  const owner = JSON.parse(localStorage.getItem("ownerUser") || "null");
  const localOrders = useMemo(() => JSON.parse(localStorage.getItem("orders")) || [], []);
  const localFoods = useMemo(() => JSON.parse(localStorage.getItem("ownerFoods")) || [], []);

  const [dashboard, setDashboard] = useState({
    totalOrders: localOrders.length,
    totalFoods: localFoods.length,
    revenue: 0,
    restaurant: null,
    orders: localOrders,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardRes, ordersRes] = await Promise.all([
          API.get("/owner/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/orders/owner", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDashboard({
          totalOrders: ordersRes.data.length || dashboardRes.data.totalOrders || 0,
          totalFoods: dashboardRes.data.totalFoods || localFoods.length || 0,
          revenue: dashboardRes.data.revenue || 0,
          restaurant: dashboardRes.data.restaurant || null,
          orders: ordersRes.data || [],
        });
      } catch {
        const localRevenue = localOrders.reduce((sum, order) => sum + Number(order.total || order.totalAmount || 0), 0);
        setDashboard({
          totalOrders: localOrders.length,
          totalFoods: localFoods.length,
          revenue: localRevenue,
          restaurant: null,
          orders: localOrders,
        });
      }
    }

    loadDashboard();
  }, [token, localOrders, localFoods.length]);

  const finance = useMemo(() => {
    const grossRevenue = dashboard.orders.reduce(
      (sum, order) => sum + Number(order.finalAmount || order.totalAmount || order.total || 0),
      0
    );
    const commission = dashboard.orders.reduce(
      (sum, order) => sum + Number(order.platformCommissionAmount || 0),
      0
    ) || Math.round((grossRevenue * COMMISSION_RATE) / 100);
    const payout = dashboard.orders.reduce(
      (sum, order) => sum + Number(order.ownerPayoutAmount || 0),
      0
    ) || Math.max(grossRevenue - commission, 0);

    return { grossRevenue, commission, payout };
  }, [dashboard.orders]);

  const logout = () => {
    localStorage.removeItem("ownerToken");
    window.location.href = "/owner/login";
  };

  return (
    <div className="owner-dashboard-page">
      <aside className="owner-sidebar">
        <div className="owner-logo">
          <img src="/logo.png" alt="CraveRun" />
          <h2>Crave<span>Run</span></h2>
        </div>

        <div className="owner-account">
          <strong>{owner?.name || "Restaurant owner"}</strong>
          <span>{owner?.phone ? `+91 ${owner.phone}` : "Partner account"}</span>
        </div>

        <nav>
          <Link to="/owner/dashboard">Dashboard</Link>
          <Link to="/owner/restaurant">Restaurant profile</Link>
          <Link to="/owner/foods">Food management</Link>
          <Link to="/owner/orders">Orders</Link>
          <Link to="/owner/revenue">Revenue and payout</Link>
          <button type="button" onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main className="owner-main">
        <div className="owner-topbar">
          <div>
            <span className="owner-kicker">Restaurant partner console</span>
            <h1>Good day, {owner?.name?.split(" ")[0] || "Partner"}</h1>
            <p>Manage restaurant setup, menu, orders, payments, commission, and payouts.</p>
          </div>

          <div className="status-pill">
            {dashboard.restaurant?.isHoliday ? "Holiday mode" : "Accepting orders"}
          </div>
        </div>

        <section className="commission-hero">
          <div>
            <span className="owner-kicker">Owner commission plan</span>
            <h2>Only {COMMISSION_RATE}% platform commission for restaurant owners.</h2>
            <p>
              This commission is charged to the restaurant owner account after paid orders.
              Customers see simple food pricing while owners can track gross revenue, commission, and net payout.
            </p>
          </div>
          <div className="commission-meter">
            <strong>{COMMISSION_RATE}%</strong>
            <span>Owner commission</span>
          </div>
        </section>

        <div className="owner-cards">
          <div className="owner-card">
            <span>Orders</span>
            <h3>{dashboard.totalOrders}</h3>
            <p>Total received</p>
          </div>

          <div className="owner-card">
            <span>Menu</span>
            <h3>{dashboard.totalFoods}</h3>
            <p>Food items</p>
          </div>

          <div className="owner-card">
            <span>Gross</span>
            <h3>{money(finance.grossRevenue || dashboard.revenue)}</h3>
            <p>Order revenue</p>
          </div>

          <div className="owner-card accent-card">
            <span>Payout</span>
            <h3>{money(finance.payout)}</h3>
            <p>After commission</p>
          </div>
        </div>

        <div className="owner-grid">
          <section className="owner-section">
            <h2>Payment split</h2>
            <div className="payout-breakdown">
              <p><span>Gross revenue</span><strong>{money(finance.grossRevenue)}</strong></p>
              <p><span>CraveRun commission ({COMMISSION_RATE}%)</span><strong>- {money(finance.commission)}</strong></p>
              <p><span>Owner payout</span><strong>{money(finance.payout)}</strong></p>
            </div>
          </section>

          <section className="owner-section">
            <h2>Quick actions</h2>
            <div className="quick-actions">
              <Link to="/owner/restaurant">Edit restaurant</Link>
              <Link to="/owner/foods">Add food</Link>
              <Link to="/owner/orders">Update orders</Link>
              <Link to="/owner/revenue">View payout</Link>
            </div>
          </section>
        </div>

        <section className="owner-section">
          <h2>Recent orders</h2>
          {dashboard.orders.length === 0 ? (
            <p>No orders received yet.</p>
          ) : (
            <div className="recent-order-list">
              {dashboard.orders.slice(0, 4).map((order) => (
                <div key={order._id || order.id} className="recent-order">
                  <div>
                    <h3>Order #{String(order._id || order.id).slice(-6)}</h3>
                    <p>{order.orderStatus || order.status || "Placed"} | {order.paymentMethod || "COD"}</p>
                  </div>
                  <strong>{money(order.finalAmount || order.totalAmount || order.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="owner-section">
          <h2>Restaurant status</h2>
          {dashboard.restaurant ? (
            <div className="restaurant-info">
              <h3>{dashboard.restaurant.name}</h3>
              <p>{dashboard.restaurant.address}</p>
              <p>{dashboard.restaurant.cuisine}</p>
              <p>Status: {dashboard.restaurant.isHoliday ? "Holiday" : dashboard.restaurant.isOpen ? "Open" : "Closed"}</p>
            </div>
          ) : (
            <p>No restaurant profile created yet. Add your restaurant details to start accepting orders.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default OwnerDashboard;
