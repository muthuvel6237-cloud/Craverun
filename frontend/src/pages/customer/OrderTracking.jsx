import { Link, useParams } from "react-router-dom";
import "./OrderTracking.css";

function OrderTracking() {
  const { id } = useParams();

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((item) => String(item.id) === String(id));

  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-card">
          <h1>Order Not Found</h1>
          <Link to="/customer/orders">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const steps = ["Order Placed", "Preparing", "Out For Delivery", "Delivered"];

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <h1>Track Order</h1>
        <p>Order #{String(order.id).slice(-6)}</p>

        <div className="tracking-steps">
          {steps.map((step, index) => (
            <div className="tracking-step active" key={step}>
              <div className="step-circle">{index + 1}</div>
              <div>
                <h3>{step}</h3>
                <p>{index === 0 ? order.orderDate : "Updating soon"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tracking-summary">
          <h2>Order Summary</h2>

          {order.items.map((item) => (
            <p key={item.id}>
              {item.name} × {item.quantity} = ₹{item.price * item.quantity}
            </p>
          ))}

          <h3>Total: ₹{order.total}</h3>
          <p>Address: {order.address}</p>
        </div>

        <Link className="back-btn" to="/customer/orders">
          Back to Orders
        </Link>
        
      </div>
    </div>
  );
}

export default OrderTracking;