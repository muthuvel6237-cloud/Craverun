import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./CustomerLogin.css";

function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      window.location.href = "/customer/login";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", icon: "👤", placeholder: "Your full name" },
    { label: "Email Address", name: "email", type: "email", icon: "✉️", placeholder: "you@example.com" },
    { label: "Phone Number", name: "phone", type: "tel", icon: "📱", placeholder: "+91 9876543210" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <Link to="/" className="auth-back">← Back to Home</Link>

        <div className="auth-logo">
          <div className="auth-logo-mark">🚀</div>
          <h2>Crave<span>Run</span></h2>
        </div>

        <div className="auth-title">
          <h1>Create Account</h1>
          <p>Join CraveRun and taste the difference 🍔</p>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          {fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label className="form-label" htmlFor={f.name}>{f.label}</label>
              <div className="input-icon-wrap">
                <span className="input-icon">{f.icon}</span>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  className="form-input"
                  placeholder={f.placeholder}
                  required
                  value={formData[f.name]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                className="form-input"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            id="register-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account 🚀"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/customer/login">Login Here</Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;