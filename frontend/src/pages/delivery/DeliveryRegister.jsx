import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./DeliveryRegister.css";

function DeliveryRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      await API.post("/delivery/register", formData);
      alert("Delivery Partner Registered");
      navigate("/delivery/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="delivery-register-page">
      <div className="delivery-register-card">
        <h1>Delivery Register</h1>
        <p>Create delivery partner account</p>

        <form className="delivery-register-form" onSubmit={register}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="delivery-register-btn" type="submit">
            Register
          </button>
        </form>

        <div className="delivery-register-footer">
          <Link to="/delivery/login">Already have account?</Link>
          <Link to="/delivery-partner">Delivery partner website</Link>
        </div>
      </div>
    </div>
  );
}

export default DeliveryRegister;
