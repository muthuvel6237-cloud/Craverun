import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const token = localStorage.getItem("token");
  const savedCoupon = JSON.parse(localStorage.getItem("selectedCoupon")) || null;

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coupon, setCoupon] = useState(savedCoupon);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const discount = coupon?.type === "flat"
    ? Number(coupon.value || 0)
    : coupon?.type === "percent"
      ? Math.round((subtotal * Number(coupon.value || 0)) / 100)
      : 0;
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 29;
  const platformFee = cart.length ? 5 : 0;
  const payable = Math.max(subtotal - discount + deliveryFee + platformFee, 0);

  const ownerCommission = useMemo(() => Math.round(payable * 0.1), [payable]);
  const estimatedOwnerPayout = Math.max(payable - ownerCommission, 0);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported in this browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setAddress(data.display_name || `${latitude}, ${longitude}`);
        } catch {
          setAddress(`${latitude}, ${longitude}`);
        }
        setLoadingLocation(false);
      },
      () => {
        alert("Please allow location permission");
        setLoadingLocation(false);
      }
    );
  };

  const removeCoupon = () => {
    localStorage.removeItem("selectedCoupon");
    setCoupon(null);
  };

  const updatePaymentDetails = (event) => {
    const { name, value } = event.target;
    setPaymentDetails((current) => ({ ...current, [name]: value }));
  };

  const validatePayment = () => {
    if (paymentMethod === "COD") return true;

    if (paymentMethod === "UPI") {
      const validUpi = /^[\w.-]+@[\w.-]+$/.test(paymentDetails.upiId.trim());
      if (!validUpi) alert("Enter a valid UPI ID, for example name@bank");
      return validUpi;
    }

    const cardDigits = paymentDetails.cardNumber.replace(/\s/g, "");
    const validCard =
      paymentDetails.cardName.trim().length >= 2 &&
      /^\d{12,19}$/.test(cardDigits) &&
      /^\d{2}\/\d{2}$/.test(paymentDetails.cardExpiry.trim()) &&
      /^\d{3,4}$/.test(paymentDetails.cardCvv.trim());

    if (!validCard) alert("Enter valid card name, number, expiry and CVV");
    return validCard;
  };

  const payOnline = async () => {
    const { data: paymentOrder } = await API.post("/payment/create-order", { amount: payable });
    const key = paymentOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!window.Razorpay || !key) {
      throw new Error("Razorpay is not ready. Add Razorpay key and check internet connection.");
    }

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency || "INR",
        name: "CraveRun",
        description: "Food order payment",
        order_id: paymentOrder.id,
        method: {
          upi: paymentMethod === "UPI",
          card: paymentMethod === "Card",
          netbanking: true,
          wallet: true,
        },
        prefill: {
          name: paymentDetails.cardName,
        },
        handler: async (response) => {
          try {
            const { data } = await API.post("/payment/verify", response);
            resolve(data.paymentReference);
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
        theme: {
          color: "#ff6b35",
        },
      });

      razorpay.open();
    });
  };

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!validatePayment()) return;

    try {
      setPlacingOrder(true);

      const items = cart.map((item) => ({
        foodId: item._id || item.id,
        quantity: item.quantity,
      }));

      const paymentReference = paymentMethod === "COD" ? "" : await payOnline();

      await API.post(
        "/orders",
        {
          items,
          deliveryAddress: address,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
          paymentReference,
          couponCode: coupon?.code || "",
          discountAmount: discount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("cart");
      localStorage.removeItem("selectedCoupon");

      alert(paymentMethod === "COD" ? "Order placed successfully" : "Payment successful. Order placed.");
      navigate("/customer/order-success");
    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <section className="checkout-card">
          <span className="checkout-kicker">Secure checkout</span>
          <h1>Review and pay</h1>
          <p className="checkout-subtitle">Set delivery address and payment before placing the order.</p>

          <div className="checkout-section">
            <label>Delivery address</label>
            <button type="button" className="location-btn" onClick={getCurrentLocation}>
              {loadingLocation ? "Getting location..." : "Use current location"}
            </button>
            <textarea
              rows="4"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter flat number, street, landmark and city"
            />
          </div>

          <div className="checkout-section">
            <label>Payment method</label>
            <div className="payment-methods">
              {["COD", "UPI", "Card"].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={paymentMethod === method ? "active" : ""}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method === "COD" ? "Cash" : method}
                </button>
              ))}
            </div>

            {paymentMethod === "UPI" && (
              <div className="payment-fields">
                <input
                  name="upiId"
                  value={paymentDetails.upiId}
                  onChange={updatePaymentDetails}
                  placeholder="UPI ID, for example name@bank"
                />
              </div>
            )}

            {paymentMethod === "Card" && (
              <div className="payment-fields card-grid">
                <input name="cardName" value={paymentDetails.cardName} onChange={updatePaymentDetails} placeholder="Name on card" />
                <input name="cardNumber" value={paymentDetails.cardNumber} onChange={updatePaymentDetails} placeholder="Card number" inputMode="numeric" />
                <input name="cardExpiry" value={paymentDetails.cardExpiry} onChange={updatePaymentDetails} placeholder="MM/YY" />
                <input name="cardCvv" value={paymentDetails.cardCvv} onChange={updatePaymentDetails} placeholder="CVV" inputMode="numeric" />
              </div>
            )}

            <p className="payment-note">
              {paymentMethod === "COD"
                ? "Pay the delivery partner when the order arrives."
                : "Payment will be marked as paid for this app flow. Razorpay can be connected with live keys later."}
            </p>
          </div>

          <div className="coupon-box">
            {coupon ? (
              <>
                <p>Coupon applied: <strong>{coupon.code}</strong></p>
                <button type="button" onClick={removeCoupon}>Remove</button>
              </>
            ) : (
              <Link to="/customer/coupons">Apply coupon</Link>
            )}
          </div>

          <button className="place-order-btn" onClick={placeOrder} disabled={placingOrder || !address || cart.length === 0}>
            {placingOrder ? "Placing order..." : paymentMethod === "COD" ? "Place order" : `Pay ${payable}`}
          </button>
        </section>

        <aside className="checkout-summary">
          <h2>Bill summary</h2>
          <div className="summary-lines">
            <p><span>Subtotal</span><strong>Rs {subtotal}</strong></p>
            <p><span>Discount</span><strong>- Rs {discount}</strong></p>
            <p><span>Delivery fee</span><strong>{deliveryFee ? `Rs ${deliveryFee}` : "Free"}</strong></p>
            <p><span>Platform fee</span><strong>Rs {platformFee}</strong></p>
          </div>

          <div className="summary-total">
            <span>Total payable</span>
            <strong>Rs {payable}</strong>
          </div>

          <div className="owner-payment-note">
            <h3>Restaurant owner split</h3>
            <p><span>CraveRun commission</span><strong>Rs {ownerCommission}</strong></p>
            <p><span>Estimated owner payout</span><strong>Rs {estimatedOwnerPayout}</strong></p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
