const Restaurant = require("../models/Restaurant");

const getOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.owner._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateRestaurant = async (req, res) => {
  try {
    const { name, address, phone, image, cuisine, isOpen } = req.body;

    let restaurant = await Restaurant.findOne({
      owner: req.owner._id,
    });

    if (restaurant) {
      restaurant.name = name || restaurant.name;
      restaurant.address = address || restaurant.address;
      restaurant.phone = phone || restaurant.phone;
      restaurant.image = image || restaurant.image;
      restaurant.cuisine = cuisine || restaurant.cuisine;

      if (typeof isOpen === "boolean") {
        restaurant.isOpen = isOpen;
      }

      await restaurant.save();

      return res.json({
        message: "Restaurant updated successfully",
        restaurant,
      });
    }

    restaurant = await Restaurant.create({
      owner: req.owner._id,
      name,
      address,
      phone,
      image,
      cuisine,
      isOpen,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      isOpen: true,
      isHoliday: false,
    }).sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleHoliday = async (req, res) => {
  try {
    const { isHoliday, holidayReason } = req.body;

    const restaurant = await Restaurant.findOne({
      owner: req.owner._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    restaurant.isHoliday = isHoliday;
    restaurant.holidayReason = isHoliday ? holidayReason || "Holiday" : "";

    await restaurant.save();

    res.json({
      message: "Holiday status updated",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getOwnerRestaurant,
  createOrUpdateRestaurant,
  toggleHoliday,
  getPublicRestaurants,
};