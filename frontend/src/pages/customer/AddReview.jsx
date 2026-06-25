import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import "./AddReview.css";

function AddReview() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/reviews",
        {
          restaurant: restaurantId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted");
      navigate(`/customer/restaurants/${restaurantId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Review failed");
    }
  };

  return (
    <div className="review-page">
      <div className="review-card">
        <h1>Add Review</h1>
        <p>Share your experience with this restaurant</p>

        <form onSubmit={submitReview}>
          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Good</option>
            <option value={3}>⭐⭐⭐ Average</option>
            <option value={2}>⭐⭐ Poor</option>
            <option value={1}>⭐ Bad</option>
          </select>

          <label>Comment</label>
          <textarea
            rows="5"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default AddReview;