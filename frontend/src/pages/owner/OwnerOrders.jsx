import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./OwnerOrders.css";

function OwnerOrders() {
  const token = localStorage.getItem("ownerToken");
  const [orders, setOrders] = useState([]);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/owner", getAuthHeader());
      setOrders(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/orders/owner", {
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

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await API.put(
        `/orders/${orderId}/status`,
        { orderStatus },
        getAuthHeader()
      );

      alert("Order status updated");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Owner Orders</h1>
          <p>Manage customer orders and update delivery status</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p>
                      Customer: {order.customer?.name} -{" "}
                      {order.customer?.phone}
                    </p>
                  </div>

                  <span className="order-status">{order.orderStatus}</span>
                </div>

                <div className="order-info">
                  <p>Total: ₹{order.totalAmount}</p>
                  <p>Payment: {order.paymentMethod}</p>
                  <p>Address: {order.deliveryAddress}</p>
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  ))}
                </div>

                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="Placed">Placed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerOrders;