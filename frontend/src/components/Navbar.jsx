import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const customerToken = localStorage.getItem("token");
  const ownerToken = localStorage.getItem("ownerToken");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ownerToken");
    window.location.href = "/";
  };

  return (
    <header className="main-navbar">
      <div className="nav-logo">
        <img src="/logo.png" alt="CraveRun" />
        <h2>
          Crave<span>Run</span>
        </h2>
      </div>

      <nav>
        <Link to="/">Home</Link>

        {!customerToken && !ownerToken && (
          <>
            <Link to="/customer/login">Customer Login</Link>
            <Link to="/owner/login">Owner Login</Link>
          </>
        )}

        {customerToken && (
          <>
            <Link to="/customer/orders">My Orders</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}

        {ownerToken && (
          <>
            <Link to="/owner/dashboard">Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;