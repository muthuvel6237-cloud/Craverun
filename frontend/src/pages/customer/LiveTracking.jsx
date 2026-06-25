import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LiveTracking.css";

function LiveTracking() {
  const { id } = useParams();

  const [status, setStatus] = useState("Preparing");
  const [eta, setEta] = useState("25 mins");

  useEffect(() => {
    const statuses = [
      "Order Placed",
      "Accepted",
      "Preparing",
      "Out For Delivery",
      "Delivered",
    ];

    let index = 2;

    const timer = setInterval(() => {
      if (index < statuses.length - 1) {
        index++;
        setStatus(statuses[index]);

        if (statuses[index] === "Out For Delivery") {
          setEta("10 mins");
        }

        if (statuses[index] === "Delivered") {
          setEta("Delivered");
        }
      }
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tracking-page">
      <div className="tracking-card">
        <h1>Live Delivery Tracking</h1>

        <p>Order #{id?.slice(-6)}</p>

        <div className="map-placeholder">
          🗺️ Google Maps / Leaflet Map Here
        </div>

        <div className="tracking-info">
          <h2>Status</h2>
          <p>{status}</p>

          <h2>Estimated Arrival</h2>
          <p>{eta}</p>
        </div>

        <div className="tracking-route">
          <div>🏪 Restaurant</div>
          <div>🛵 Delivery Partner</div>
          <div>🏠 Customer</div>
        </div>
      </div>
    </div>
  );
}

export default LiveTracking;