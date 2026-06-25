import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./RestaurantProfile.css";

function RestaurantProfile() {
  const token = localStorage.getItem("ownerToken");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    image: "",
    cuisine: "",
    isOpen: true,
    isHoliday: false,
    holidayReason: "",
  });

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const res = await API.get("/restaurants/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          name: res.data.name || "",
          address: res.data.address || "",
          phone: res.data.phone || "",
          image: res.data.image || "",
          cuisine: res.data.cuisine || "",
          isOpen: res.data.isOpen,
          isHoliday: res.data.isHoliday,
          holidayReason: res.data.holidayReason || "",
        });
      } catch {
        console.log("No restaurant profile yet");
      }
    }

    loadRestaurant();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      await API.post("/restaurants/owner", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Restaurant profile saved");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save restaurant");
    }
  };

  const toggleHoliday = async () => {
    try {
      const updatedHoliday = !formData.isHoliday;

      const res = await API.put(
        "/restaurants/holiday",
        {
          isHoliday: updatedHoliday,
          holidayReason: formData.holidayReason || "Holiday",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        ...formData,
        isHoliday: res.data.restaurant.isHoliday,
        holidayReason: res.data.restaurant.holidayReason,
      });

      alert(updatedHoliday ? "Holiday mode ON" : "Holiday mode OFF");
    } catch (error) {
      alert(error.response?.data?.message || "Holiday update failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Restaurant Profile</h1>
        <p>Update your restaurant details and holiday status</p>

        <form className="profile-form" onSubmit={saveProfile}>
          <input
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            name="cuisine"
            placeholder="Cuisine Type"
            value={formData.cuisine}
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Restaurant Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <label className="profile-check">
            <input
              type="checkbox"
              name="isOpen"
              checked={formData.isOpen}
              onChange={handleChange}
            />
            Restaurant Open
          </label>

          <input
            name="holidayReason"
            placeholder="Holiday Reason"
            value={formData.holidayReason}
            onChange={handleChange}
          />

          <button className="profile-save-btn" type="submit">
            Save Profile
          </button>
        </form>

        <div className="holiday-box">
          <h2>Holiday Status</h2>

          <p>
            {formData.isHoliday
              ? "Restaurant is on Holiday"
              : "Restaurant is Active"}
          </p>

          <button className="holiday-btn" type="button" onClick={toggleHoliday}>
            {formData.isHoliday ? "Turn OFF Holiday" : "Turn ON Holiday"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantProfile;