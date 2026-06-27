import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./PhoneOtpAuth.css";

const accountConfig = {
  customer: {
    title: "CraveRun Food",
    loginHeading: "Login with mobile",
    registerHeading: "Create customer account",
    endpoint: "/auth",
    tokenKey: "token",
    userKey: "user",
    dashboard: "/customer/home",
    accent: "customer",
  },
  owner: {
    title: "CraveRun Partner",
    loginHeading: "Restaurant owner login",
    registerHeading: "Register your restaurant account",
    endpoint: "/owner",
    tokenKey: "ownerToken",
    userKey: "ownerUser",
    dashboard: "/owner/dashboard",
    accent: "owner",
  },
  delivery: {
    title: "CraveRun Delivery",
    loginHeading: "Delivery partner login",
    registerHeading: "Become a delivery partner",
    endpoint: "/delivery",
    tokenKey: "deliveryToken",
    userKey: "deliveryUser",
    dashboard: "/delivery/dashboard",
    accent: "delivery",
  },
};

function PhoneOtpAuth({ accountType, mode }) {
  const config = accountConfig[accountType];
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", phone: "", email: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "phone") {
      setOtpSent(false);
      setDevOtp("");
      setForm((current) => ({ ...current, phone: value.replace(/\D/g, "").slice(0, 10), otp: "" }));
    }
  };

  const sendOtp = async () => {
    setError("");
    setMessage("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post(`/auth/${accountType}/${mode}/send-otp`, { phone: form.phone });
      setOtpSent(true);
      setDevOtp(response.data.devOtp || "");
      setMessage("OTP sent. It is valid for 5 minutes.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!otpSent) return sendOtp();
    if (!/^\d{6}$/.test(form.otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const payload = isRegister
        ? { name: form.name.trim(), phone: form.phone, email: form.email.trim() || undefined, otp: form.otp }
        : { phone: form.phone, otp: form.otp };
      const response = await API.post(`${config.endpoint}/${mode}`, payload);
      const account = response.data.user || response.data.owner || response.data.delivery;
      localStorage.setItem(config.tokenKey, response.data.token);
      if (account) localStorage.setItem(config.userKey, JSON.stringify(account));
      navigate(config.dashboard, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || `${isRegister ? "Registration" : "Login"} failed.`);
    } finally {
      setLoading(false);
    }
  };

  const otherMode = isRegister ? "login" : "register";
  const basePath = accountType === "customer" ? "/customer" : `/${accountType}`;

  return (
    <main className={`phone-auth phone-auth--${config.accent}`}>
      <section className="phone-auth__card">
        <Link className="phone-auth__back" to="/">Back to CraveRun</Link>
        <div className="phone-auth__brand"><span>CR</span>{config.title}</div>
        <h1>{isRegister ? config.registerHeading : config.loginHeading}</h1>
        <p>{isRegister ? "Enter your details and verify your mobile number." : "No password needed. We will verify your mobile with an OTP."}</p>

        {error && <div className="phone-auth__notice phone-auth__notice--error" role="alert">{error}</div>}
        {message && <div className="phone-auth__notice">{message}</div>}
        {devOtp && <div className="phone-auth__dev">Testing OTP: <strong>{devOtp}</strong></div>}

        <form onSubmit={submit}>
          {isRegister && (
            <label>Full name
              <input name="name" value={form.name} onChange={update} placeholder="Enter your full name" required autoComplete="name" />
            </label>
          )}
          <label>Mobile number
            <div className="phone-auth__phone"><span>+91</span><input name="phone" value={form.phone} onChange={update} inputMode="numeric" placeholder="9876543210" required autoComplete="tel" /></div>
          </label>
          {isRegister && (
            <label>Email <small>optional</small>
              <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" />
            </label>
          )}
          {otpSent && (
            <label>6-digit OTP
              <input name="otp" value={form.otp} onChange={update} inputMode="numeric" maxLength="6" placeholder="Enter OTP" required autoComplete="one-time-code" />
            </label>
          )}
          <button className="phone-auth__primary" disabled={loading} type="submit">
            {loading ? "Please wait..." : otpSent ? (isRegister ? "Verify and create account" : "Verify and login") : "Send OTP"}
          </button>
          {otpSent && <button className="phone-auth__secondary" disabled={loading} type="button" onClick={sendOtp}>Resend OTP</button>}
        </form>

        <div className="phone-auth__switch">
          {isRegister ? "Already registered?" : "New to CraveRun?"} <Link to={`${basePath}/${otherMode}`}>{isRegister ? "Login" : "Create account"}</Link>
        </div>
      </section>
    </main>
  );
}

export default PhoneOtpAuth;
