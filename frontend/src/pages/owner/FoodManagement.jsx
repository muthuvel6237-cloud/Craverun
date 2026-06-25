import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./FoodManagement.css";

const IMAGE_BASE_URL = "http://127.0.0.1:5000";

function FoodManagement() {
  const token = localStorage.getItem("ownerToken");

  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    isAvailable: true,
  });

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${IMAGE_BASE_URL}${image}`;
  };

  const fetchFoods = async () => {
    try {
      const res = await API.get("/foods/owner", getAuthHeader());
      setFoods(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load foods");
    }
  };

  useEffect(() => {
    async function loadFoods() {
      try {
        const res = await API.get("/foods/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFoods(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load foods");
      }
    }

    loadFoods();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploading(true);

      const res = await API.post("/upload/food-image", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: res.data.imageUrl,
      }));

      alert("Image uploaded");
    } catch (error) {
      alert(error.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      isAvailable: true,
    });

    setEditingId(null);
  };

  const saveFood = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingId) {
        await API.put(`/foods/${editingId}`, payload, getAuthHeader());
        alert("Food updated");
      } else {
        await API.post("/foods", payload, getAuthHeader());
        alert("Food added");
      }

      resetForm();
      fetchFoods();
    } catch (error) {
      alert(error.response?.data?.message || "Food save failed");
    }
  };

  const editFood = (food) => {
    setEditingId(food._id);

    setFormData({
      name: food.name || "",
      description: food.description || "",
      price: food.price || "",
      image: food.image || "",
      category: food.category || "",
      isAvailable: food.isAvailable ?? true,
    });
  };

  const deleteFood = async (id) => {
    const confirmDelete = window.confirm("Delete this food?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/foods/${id}`, getAuthHeader());
      alert("Food deleted");
      fetchFoods();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="food-page">
      <div className="food-container">
        <div className="food-header">
          <h1>Food Management</h1>
          <p>Add, edit and manage your restaurant menu items</p>
        </div>

        <div className="food-form-card">
          <form className="food-form" onSubmit={saveFood}>
            <input
              name="name"
              placeholder="Food Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {uploading && <p>Uploading image...</p>}

            {formData.image && (
              <img
                src={getImageUrl(formData.image)}
                alt="Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "14px",
                }}
              />
            )}

            <label className="food-check">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Available
            </label>

            <button className="food-btn" type="submit" disabled={uploading}>
              {editingId ? "Update Food" : "Add Food"}
            </button>

            {editingId && (
              <button
                className="food-btn cancel-btn"
                type="button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <h2 className="food-list-title">Food List</h2>

        {foods.length === 0 ? (
          <div className="empty-food">
            <p>No foods added yet</p>
          </div>
        ) : (
          <div className="food-list">
            {foods.map((food) => (
              <div className="food-item-card" key={food._id}>
                {food.image ? (
                  <img src={getImageUrl(food.image)} alt={food.name} />
                ) : (
                  <div className="food-placeholder">🍔</div>
                )}

                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p className="food-price">₹{food.price}</p>
                <p>{food.category}</p>
                <p>{food.isAvailable ? "Available" : "Not Available"}</p>

                <div className="food-actions">
                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() => editFood(food)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() => deleteFood(food._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodManagement;