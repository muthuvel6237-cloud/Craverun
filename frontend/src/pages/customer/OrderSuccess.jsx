import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h1>Order Placed Successfully!</h1>
        <p>Your food order has been placed. Track it from My Orders.</p>

        <div className="success-actions">
          <Link to="/customer/orders">View My Orders</Link>
          <Link to="/customer/home" className="secondary-btn">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;