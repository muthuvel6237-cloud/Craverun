import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginAdmin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/admin/login", formData);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.admin)
      );

      alert("Admin Login Successful");
      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>CraveRun Admin</h1>
        <p>Platform Management Portal</p>

        <form onSubmit={loginAdmin}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <Link to="/">
          Back To Home
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;