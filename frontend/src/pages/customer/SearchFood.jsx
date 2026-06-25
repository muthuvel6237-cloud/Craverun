import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/axios";
import "./SearchFood.css";

const IMAGE_BASE_URL = "http://127.0.0.1:5000";

function SearchFood() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [search, setSearch] = useState(query);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    async function loadFoods() {
      try {
        const res = await API.get("/foods/public");
        setFoods(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load foods");
      }
    }

    loadFoods();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/foods/burger.png";
    if (image.startsWith("http")) return image;
    return `${IMAGE_BASE_URL}${image}`;
  };

  const addToCart = (food) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === food._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...food, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${food.name} added to cart`);
  };

  const filteredFoods = foods.filter((food) =>
    food.name?.toLowerCase().includes(search.toLowerCase()) ||
    food.category?.toLowerCase().includes(search.toLowerCase()) ||
    food.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="food-search-page">
      <div className="food-search-header">
        <h1>Search Foods</h1>

        <input
          type="text"
          placeholder="Search pizza, burger, biryani..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredFoods.length === 0 ? (
        <div className="no-foods">
          <p>No foods found</p>
        </div>
      ) : (
        <div className="food-search-grid">
          {filteredFoods.map((food) => (
            <div className="food-search-card" key={food._id}>
              <img src={getImageUrl(food.image)} alt={food.name} />

              <h3>{food.name}</h3>
              <p>{food.category}</p>
              <h4>₹{food.price}</h4>

              <button type="button" onClick={() => addToCart(food)}>
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchFood;