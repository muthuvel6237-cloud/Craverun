const express = require("express");

const {
  addFood,
  deleteFood,
  getOwnerFoods,
  getPublicFoods,
  getRestaurantFoods,
  updateFood,
} = require("../controllers/foodController");

const { protectOwner } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/public", getPublicFoods);
router.get("/restaurant/:restaurantId", getRestaurantFoods);
router.get("/owner", protectOwner, getOwnerFoods);
router.post("/", protectOwner, addFood);
router.put("/:id", protectOwner, updateFood);
router.delete("/:id", protectOwner, deleteFood);

module.exports = router;
