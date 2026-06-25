import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminRestaurant.css";

function AdminRestaurants() {
  const token = localStorage.getItem("adminToken");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await API.get("/admin/restaurants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurants(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load restaurants");
      }
    }

    loadRestaurants();
  }, [token]);

  return (
    <div className="admin-restaurants-page">
      <h1>Restaurants</h1>

      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <div className="restaurant-card" key={restaurant._id}>
            <h2>{restaurant.name}</h2>

            <p>
              <strong>Owner:</strong>{" "}
              {restaurant.owner?.name || "Not Assigned"}
            </p>

            <p>
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </p>

            <p>
              <strong>Address:</strong> {restaurant.address}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {restaurant.isHoliday
                ? "Holiday"
                : restaurant.isOpen
                ? "Open"
                : "Closed"}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(restaurant.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRestaurants;