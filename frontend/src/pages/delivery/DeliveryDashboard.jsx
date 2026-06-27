import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./DeliveryDashboard.css";

function money(value) {
  return `Rs ${Math.round(Number(value) || 0)}`;
}

function DeliveryDashboard() {
  const token = localStorage.getItem("deliveryToken");
  const deliveryUser = JSON.parse(localStorage.getItem("deliveryUser") || "null");
  const [orders, setOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/delivery/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch {
        setOrders([]);
      }
    }

    loadOrders();
  }, [token]);

  const stats = useMemo(() => {
    const delivered = orders.filter((order) => order.orderStatus === "Delivered").length;
    const active = orders.filter((order) => order.orderStatus !== "Delivered").length;
    const cashToCollect = orders.reduce((sum, order) => (
      order.paymentMethod === "COD" && order.orderStatus !== "Delivered"
        ? sum + Number(order.finalAmount || order.totalAmount || 0)
        : sum
    ), 0);

    return { delivered, active, cashToCollect };
  }, [orders]);

  const logout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryUser");
    window.location.href = "/delivery/login";
  };

  return (
    <div className="delivery-app-page">
      <header className="delivery-app-header">
        <div>
          <span>CraveRun Delivery Partner</span>
          <h1>Hello, {deliveryUser?.name?.split(" ")[0] || "Partner"}</h1>
          <p>Assigned orders, pickup details, delivery address and cash collection.</p>
        </div>
        <div className="delivery-header-actions">
          <button className={`availability-toggle ${isOnline ? "is-online" : ""}`} type="button" onClick={() => setIsOnline((value) => !value)}>
            <i /> {isOnline ? "Online" : "Offline"}
          </button>
          <Link to="/delivery-partner">Website</Link>
          <button className="delivery-logout" type="button" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="delivery-shift-strip">
        <div><strong>{isOnline ? "You are accepting jobs" : "You are currently offline"}</strong><span>{isOnline ? "New nearby deliveries will appear here." : "Go online when you are ready to deliver."}</span></div>
        <span>{deliveryUser?.phone ? `+91 ${deliveryUser.phone}` : "Verified partner"}</span>
      </div>

      <section className="delivery-cards">
        <article>
          <span>Total jobs</span>
          <h3>{orders.length}</h3>
          <p>Assigned orders</p>
        </article>
        <article>
          <span>Active</span>
          <h3>{stats.active}</h3>
          <p>Pending delivery</p>
        </article>
        <article>
          <span>Completed</span>
          <h3>{stats.delivered}</h3>
          <p>Delivered orders</p>
        </article>
        <article className="cash-card">
          <span>Cash collect</span>
          <h3>{money(stats.cashToCollect)}</h3>
          <p>COD active jobs</p>
        </article>
      </section>

      <section className="delivery-orders-section">
        <div className="delivery-section-title">
          <h2>Assigned Orders</h2>
          <p>Use this as the Android/iOS delivery partner job app.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No assigned orders</h3>
            <p>New delivery jobs will appear here when assigned by the platform.</p>
          </div>
        ) : (
          <div className="delivery-orders">
            {orders.map((order) => (
              <article className="delivery-order-card" key={order._id}>
                <div className="job-top">
                  <div>
                    <span>Order #{order._id.slice(-6)}</span>
                    <h3>{order.restaurant?.name || "Restaurant pickup"}</h3>
                  </div>
                  <strong>{order.orderStatus}</strong>
                </div>

                <p><b>Drop address:</b> {order.deliveryAddress}</p>
                <p><b>Payment:</b> {order.paymentMethod} | {order.paymentStatus}</p>
                <p><b>Amount:</b> {money(order.finalAmount || order.totalAmount)}</p>

                <div className="job-actions">
                  <button type="button">Start delivery</button>
                  <button type="button">Mark delivered</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DeliveryDashboard;
