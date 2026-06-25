import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./OwnerRegister.css";

function OwnerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await API.post("/owner/register", formData);
      alert("Owner registered successfully");
      window.location.href = "/owner/login";
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Registration failed");
    }
  };

  return (
    <div className="owner-register-page">
      <div className="owner-register-navbar">
        <div className="owner-register-brand">
          <img src="/logo.png" alt="CraveRun" />
          <h2>Crave<span>Run</span></h2>
        </div>

        <div className="owner-register-links">
          <Link to="/">Home</Link>
          <Link to="/owner/login">Login</Link>
          <Link to="/customer/register">Customer</Link>
        </div>
      </div>

      <div className="owner-register-card">
        <div className="owner-register-icon">10%</div>
        <h1>Restaurant Owner Register</h1>
        <p>Create a partner account with commission, payment and payout tracking.</p>

        <form onSubmit={handleSubmit}>
          <label>Owner name</label>
          <div className="owner-register-input">
            <span>Name</span>
            <input type="text" name="name" placeholder="Enter owner name" onChange={handleChange} required />
          </div>

          <label>Email</label>
          <div className="owner-register-input">
            <span>Email</span>
            <input type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
          </div>

          <label>Phone number</label>
          <div className="owner-register-input">
            <span>Phone</span>
            <input type="text" name="phone" placeholder="Enter phone number" onChange={handleChange} required />
          </div>

          <label>Password</label>
          <div className="owner-register-input">
            <span>Pass</span>
            <input type="password" name="password" placeholder="Create password" onChange={handleChange} required />
          </div>

          <button type="submit" className="owner-register-btn">
            Create Restaurant Account
          </button>
        </form>

        <p className="owner-login-link">
          Already have an account? <Link to="/owner/login">Login Now</Link>
        </p>
      </div>
    </div>
  );
}

export default OwnerRegister;
