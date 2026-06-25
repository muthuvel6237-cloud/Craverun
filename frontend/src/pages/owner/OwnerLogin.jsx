import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./OwnerLogin.css";

function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await API.post("/owner/login", { email, password });
      localStorage.setItem("ownerToken", res.data.token);
      alert("Owner login successful");
      window.location.href = "/owner/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="owner-login-page">
      <div className="owner-login-navbar">
        <div className="owner-login-brand">
          <img src="/logo.png" alt="CraveRun" />
          <h2>Crave<span>Run</span></h2>
        </div>

        <div className="owner-login-links">
          <Link to="/">Home</Link>
          <Link to="/owner/register">Register</Link>
          <Link to="/customer/login">Customer</Link>
        </div>
      </div>

      <div className="owner-login-card">
        <div className="owner-login-icon">Owner</div>
        <h1>Owner Login</h1>
        <p>Manage restaurant orders, menu, payments, commission and payout.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="owner-input-box">
            <span>Email</span>
            <input
              type="email"
              placeholder="Enter owner email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <label>Password</label>
          <div className="owner-input-box">
            <span>Pass</span>
            <input
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="owner-login-btn">
            Login to Dashboard
          </button>
        </form>

        <p className="owner-register-text">
          New restaurant owner? <Link to="/owner/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default OwnerLogin;
