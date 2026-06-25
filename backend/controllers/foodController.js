const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

const getRestaurantFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.restaurantId,
      isAvailable: true,
    }).sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .populate("restaurant", "name address cuisine isOpen isHoliday")
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFood = async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable } = req.body;

    const restaurant = await Restaurant.findOne({ owner: req.owner._id });

    if (!restaurant) {
      return res.status(400).json({
        message: "Create restaurant profile first",
      });
    }

    const food = await Food.create({
      restaurant: restaurant._id,
      owner: req.owner._id,
      name,
      description,
      price: Number(price),
      image,
      category,
      isAvailable,
    });

    res.status(201).json({
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerFoods = async (req, res) => {
  try {
    const foods = await Food.find({ owner: req.owner._id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFood = async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      owner: req.owner._id,
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const { name, description, price, image, category, isAvailable } = req.body;

    if (name !== undefined) food.name = name;
    if (description !== undefined) food.description = description;
    if (price !== undefined) food.price = Number(price);
    if (image !== undefined) food.image = image;
    if (category !== undefined) food.category = category;
    if (typeof isAvailable === "boolean") food.isAvailable = isAvailable;

    await food.save();

    res.json({
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findOne({
      _id: req.params.id,
      owner: req.owner._id,
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFood,
  updateFood,
  deleteFood,
  getOwnerFoods,
  getRestaurantFoods,
  getPublicFoods,
};
