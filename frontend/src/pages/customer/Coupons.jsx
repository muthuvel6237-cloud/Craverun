import { useState } from "react";
import "./Coupons.css";

function Coupons() {
  const [copiedCode, setCopiedCode] = useState("");

  const coupons = [
    {
      code: "SAVE50",
      title: "₹50 OFF",
      description: "Get ₹50 off on orders above ₹199",
      type: "flat",
      value: 50,
    },
    {
      code: "WELCOME20",
      title: "20% OFF",
      description: "Get 20% off on your first order",
      type: "percent",
      value: 20,
    },
    {
      code: "CRAVERUN100",
      title: "₹100 OFF",
      description: "Get ₹100 off on orders above ₹499",
      type: "flat",
      value: 100,
    },
    {
      code: "FREEDELIVERY",
      title: "Free Delivery",
      description: "No delivery charge on this order",
      type: "delivery",
      value: 0,
    },
  ];

  const copyCoupon = (coupon) => {
    localStorage.setItem("selectedCoupon", JSON.stringify(coupon));
    navigator.clipboard.writeText(coupon.code);
    setCopiedCode(coupon.code);
    alert(`${coupon.code} copied and applied`);
  };

  return (
    <div className="coupons-page">
      <div className="coupons-header">
        <h1>Coupons & Offers 🎁</h1>
        <p>Save more on your CraveRun orders</p>
      </div>

      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <div className="coupon-card" key={coupon.code}>
            <div className="coupon-left">
              <h2>{coupon.title}</h2>
              <p>{coupon.description}</p>
              <span>{coupon.code}</span>
            </div>

            <button type="button" onClick={() => copyCoupon(coupon)}>
              {copiedCode === coupon.code ? "Applied ✓" : "Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coupons;