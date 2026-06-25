const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { restaurant, food, rating, comment } = req.body;

    const review = await Review.create({
      customer: req.user.id,
      restaurant,
      food,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getRestaurantReviews,
};