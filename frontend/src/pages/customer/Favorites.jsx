import { useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function Favorites() {
  const [favorites] = useState(getFavorites);

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorites ❤️</h1>
        <p>Your saved foods and restaurants</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <h3>No Favorites Yet</h3>
          <Link to="/customer/restaurants">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div className="favorite-card" key={item._id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;