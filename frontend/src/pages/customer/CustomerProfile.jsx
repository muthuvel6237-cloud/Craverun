import { Link } from "react-router-dom";
import "./CustomerProfile.css";

function CustomerProfile() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.location.href = "/customer/login";
  };

  return (
    <div className="profile-customer-page">
      <div className="profile-customer-card">
        <div className="profile-avatar">👤</div>

        <h1>My Profile</h1>
        <p>Manage your CraveRun account</p>

        <div className="profile-menu">
          <Link to="/customer/orders">🛍️ My Orders</Link>
          <Link to="/customer/cart">🛒 My Cart</Link>
          <Link to="/customer/home">🏠 Home</Link>
          <button onClick={logout}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;