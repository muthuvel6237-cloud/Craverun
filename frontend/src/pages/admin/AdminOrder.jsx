import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminOrder.css";

function AdminOrders() {
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
        alert(error.response?.data?.message || "Failed to load orders");
      }
    }

    loadOrders();
  }, [token]);

  return (
    <div className="admin-orders-page">
      <h1>All Orders</h1>

      {orders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-top">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span>{order.orderStatus}</span>
              </div>

              <p><b>Customer:</b> {order.customer?.name}</p>
              <p><b>Restaurant:</b> {order.restaurant?.name}</p>
              <p><b>Owner:</b> {order.owner?.name}</p>
              <p><b>Total:</b> ₹{order.totalAmount}</p>
              <p><b>Payment:</b> {order.paymentMethod}</p>
              <p><b>Address:</b> {order.deliveryAddress}</p>

              <div className="admin-order-items">
                <h4>Items</h4>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.name} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;