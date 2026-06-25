import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./CustomerLogin.css";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/customer/home";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back link */}
        <Link to="/" className="auth-back">← Back to Home</Link>

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-mark">🛵</div>
          <h2>Crave<span>Run</span></h2>
        </div>

        {/* Title */}
        <div className="auth-title">
          <h1>Welcome Back!</h1>
          <p>Login to order your favourite food 🍕</p>
        </div>

        {/* Error */}
        {error && <div className="auth-error" role="alert">{error}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login → Order Food 🍔"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/customer/register">Register Free</Link>
        </div>

        <div className="auth-divider">or continue as</div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link
            to="/owner/login"
            style={{
              flex: 1,
              background: "var(--cr-surface)",
              border: "1px solid var(--cr-border)",
              borderRadius: "var(--cr-r-sm)",
              padding: "12px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--cr-text-2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            🏪 Owner
          </Link>
          <Link
            to="/delivery/login"
            style={{
              flex: 1,
              background: "var(--cr-surface)",
              border: "1px solid var(--cr-border)",
              borderRadius: "var(--cr-r-sm)",
              padding: "12px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--cr-text-2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            🛵 Delivery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;