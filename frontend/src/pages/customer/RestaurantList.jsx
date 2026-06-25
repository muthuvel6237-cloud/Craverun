import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./RestaurantList.css";

const IMAGE_BASE_URL = "http://127.0.0.1:5000";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await API.get("/restaurants/public");
        setRestaurants(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load restaurants");
      }
    }

    loadRestaurants();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/foods/biryani.png";
    if (image.startsWith("http")) return image;
    return `${IMAGE_BASE_URL}${image}`;
  };

  const filteredRestaurants = restaurants.filter((res) => {
    const text = search.toLowerCase();

    return (
      res.name?.toLowerCase().includes(text) ||
      res.cuisine?.toLowerCase().includes(text) ||
      res.address?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="restaurant-page">
      <div className="restaurant-header">
        <h1>Restaurants Near You</h1>
        <p>Choose your favourite restaurant and order food</p>
      </div>

      <div className="restaurant-search">
        <input
          type="text"
          placeholder="🔍 Search restaurants, pizza, biryani, burgers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="no-restaurants">
          <p>No restaurants found</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {filteredRestaurants.map((res) => (
            <Link
              to={`/customer/restaurants/${res._id}`}
              className="restaurant-card"
              key={res._id}
            >
              <img src={getImageUrl(res.image)} alt={res.name} />

              <div>
                <h2>{res.name}</h2>
                <p>{res.cuisine}</p>

                <div className="restaurant-meta">
                  <span>⭐ 4.5</span>
                  <span>⏱ 25-30 min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default RestaurantList;