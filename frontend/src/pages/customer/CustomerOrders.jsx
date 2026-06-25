import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./CustomerOrders.css";

function CustomerOrders() {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load your orders");
      }
    }

    loadOrders();
  }, [token]);

  return (
    <div className="customer-orders-page">
      <div className="customer-orders-container">
        <div className="customer-orders-header">
          <h1>My Orders</h1>
          <p>Track your CraveRun food orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="customer-empty-orders">
            <p>No orders yet</p>
            <Link to="/customer/restaurants">Order Now</Link>
          </div>
        ) : (
          <div className="customer-orders-list">
            {orders.map((order) => (
              <div className="customer-order-card" key={order._id}>
                <div className="customer-order-top">
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p>{order.createdAt?.slice(0, 10)}</p>
                  </div>

                  <span>{order.orderStatus}</span>
                </div>

                <div className="customer-order-info">
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Payment: {order.paymentMethod}</p>
                  <p>Delivery Address: {order.deliveryAddress}</p>
                </div>

                <div className="customer-order-items">
                  <h4>Items</h4>

                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  ))}
                </div>

                <Link
                  to={`/customer/orders/${order._id}`}
                  className="track-order-btn"
                >
                  Track Order
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerOrders;