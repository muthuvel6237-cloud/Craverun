import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import "./DeliveryLogin.css";

function DeliveryLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/delivery/login", {
        email,
        password,
      });

      localStorage.setItem("deliveryToken", res.data.token);
      localStorage.setItem(
        "deliveryUser",
        JSON.stringify(res.data.delivery)
      );

      alert("Login Successful");
      navigate("/delivery/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-login-page">
      <div className="delivery-login-card">
        <div className="delivery-logo">
          <img src="/logo.png" alt="CraveRun" />
          <h2>
            Crave<span>Run</span>
          </h2>
        </div>

        <h1>Delivery Partner Login</h1>
        <p>Login to manage and deliver customer orders</p>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="delivery-links">
          <Link to="/delivery-partner">Delivery Website</Link>
          <Link to="/food-delivery">Customer App</Link>
          <Link to="/restaurant-partner">Partner App</Link>
        </div>
      </div>
    </div>
  );
}

export default DeliveryLogin;
