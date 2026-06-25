import { useState } from "react";
import "./Notifications.css";

function getSavedNotifications() {
  return JSON.parse(localStorage.getItem("notifications")) || [];
}

function Notifications() {
  const [notifications] = useState(getSavedNotifications);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Latest updates from CraveRun</p>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <h3>No Notifications Yet</h3>
          <p>Your order updates will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((item, index) => (
            <div className="notification-card" key={index}>
              <div className="notification-icon">🔔</div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;