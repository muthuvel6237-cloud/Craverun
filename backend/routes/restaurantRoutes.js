const express = require("express");

const {
  getOwnerRestaurant,
  getPublicRestaurants,
  createOrUpdateRestaurant,
  toggleHoliday,
} = require("../controllers/restaurantController");

const { protectOwner } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/public", getPublicRestaurants);

router.get("/owner", protectOwner, getOwnerRestaurant);
router.post("/owner", protectOwner, createOrUpdateRestaurant);
router.put("/owner", protectOwner, createOrUpdateRestaurant);
router.put("/holiday", protectOwner, toggleHoliday);

module.exports = router;