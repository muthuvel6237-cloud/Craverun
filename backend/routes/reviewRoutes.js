const express = require("express");
const {
  addReview,
  getRestaurantReviews,
} = require("../controllers/reviewController");

const { protectUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protectUser, addReview);
router.get("/restaurant/:restaurantId", getRestaurantReviews);

module.exports = router;