const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Owner = require("../models/Owner");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Order = require("../models/Order");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerOwner = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingOwner = await Owner.findOne({ email });

    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Owner registered successfully",
      token: generateToken(owner._id),
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Owner login successful",
      token: generateToken(owner._id),
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.owner._id;

    const restaurant = await Restaurant.findOne({ owner: ownerId });
    const totalFoods = await Food.countDocuments({ owner: ownerId });
    const totalOrders = await Order.countDocuments({ owner: ownerId });

    const orders = await Order.find({ owner: ownerId });
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      restaurant,
      totalFoods,
      totalOrders,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerOwner,
  loginOwner,
  getOwnerDashboard,
};