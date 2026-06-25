import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./OwnerRevenue.css";

const COMMISSION_RATE = 10;

function money(value) {
  return `Rs ${Math.round(Number(value) || 0)}`;
}

function OwnerRevenue() {
  const token = localStorage.getItem("ownerToken");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/orders/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load revenue");
      }
    }

    loadOrders();
  }, [token]);

  const totals = useMemo(() => {
    const gross = orders.reduce((sum, order) => sum + Number(order.finalAmount || order.totalAmount || 0), 0);
    const commission = orders.reduce((sum, order) => sum + Number(order.platformCommissionAmount || 0), 0)
      || Math.round((gross * COMMISSION_RATE) / 100);
    const payout = orders.reduce((sum, order) => sum + Number(order.ownerPayoutAmount || 0), 0)
      || Math.max(gross - commission, 0);

    return { gross, commission, payout };
  }, [orders]);

  return (
    <div className="owner-revenue-page">
      <div className="revenue-header">
        <div>
          <span>Restaurant owner payment</span>
          <h1>Revenue and Payout</h1>
          <p>Track order payments, CraveRun commission, and net owner payout.</p>
        </div>
        <Link to="/owner/dashboard">Back to dashboard</Link>
      </div>

      <div className="revenue-cards">
        <article>
          <span>Gross orders</span>
          <h2>{money(totals.gross)}</h2>
          <p>Total paid by customers before owner commission.</p>
        </article>
        <article>
          <span>CraveRun commission</span>
          <h2>{money(totals.commission)}</h2>
          <p>{COMMISSION_RATE}% platform commission for restaurant owners.</p>
        </article>
        <article className="payout-card">
          <span>Owner payout</span>
          <h2>{money(totals.payout)}</h2>
          <p>Amount payable to the restaurant owner.</p>
        </article>
      </div>

      <section className="revenue-table">
        <h2>Order payment history</h2>
        {orders.length === 0 ? (
          <p>No paid orders yet.</p>
        ) : (
          <div className="revenue-orders">
            {orders.map((order) => (
              <div key={order._id} className="revenue-order">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p>{order.orderStatus} | {order.paymentMethod} | {order.paymentStatus}</p>
                </div>
                <span>{money(order.finalAmount || order.totalAmount)}</span>
                <span>- {money(order.platformCommissionAmount || (Number(order.finalAmount || order.totalAmount || 0) * COMMISSION_RATE) / 100)}</span>
                <strong>{money(order.ownerPayoutAmount || Number(order.finalAmount || order.totalAmount || 0) * 0.9)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OwnerRevenue;
