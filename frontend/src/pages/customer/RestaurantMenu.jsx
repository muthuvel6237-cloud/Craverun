import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import "./RestaurantMenu.css";

const IMAGE_BASE_URL = "http://127.0.0.1:5000";

function RestaurantMenu() {
  const { id } = useParams();

  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadFoodsAndReviews() {
      try {
        const foodRes = await API.get(`/foods/restaurant/${id}`);
        setFoods(foodRes.data);

        const reviewRes = await API.get(`/reviews/restaurant/${id}`);
        setReviews(reviewRes.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to load menu");
      }
    }

    loadFoodsAndReviews();
  }, [id]);

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
      cart.push({
        ...food,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${food.name} added to cart`);
  };

  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce((sum, item) => sum + Number(item.rating), 0) /
          reviews.length
        ).toFixed(1);

  return (
    <div className="menu-page">
      <div className="restaurant-banner">
        <div>
          <h1>Restaurant Menu</h1>
          <p>
            ⭐ {averageRating || "No ratings yet"} • {reviews.length} reviews
          </p>
        </div>

        <div className="banner-actions">
          <Link to={`/customer/review/${id}`} className="cart-link">
            Add Review ⭐
          </Link>

          <Link to="/customer/cart" className="cart-link">
            Go To Cart 🛒
          </Link>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="empty-foods">No foods available</div>
      ) : (
        <div className="food-list">
          {foods.map((food) => (
            <div className="food-item" key={food._id}>
              <img src={getImageUrl(food.image)} alt={food.name} />

              <div className="food-info">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <h4>₹{food.price}</h4>
              </div>

              <button type="button" onClick={() => addToCart(food)}>
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <Link to={`/customer/review/${id}`}>Write Review</Link>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-foods">No reviews yet</div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <h3>{review.customer?.name || "Customer"}</h3>
                <p className="review-rating">⭐ {review.rating}/5</p>
                <p>{review.comment}</p>
                <small>{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenu;