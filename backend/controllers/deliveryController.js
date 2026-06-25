const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Delivery = require("../models/Delivery");
const Order = require("../models/Order");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerDelivery = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingDelivery = await Delivery.findOne({ email });

    if (existingDelivery) {
      return res.status(400).json({ message: "Delivery partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const delivery = await Delivery.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Delivery partner registered successfully",
      token: generateToken(delivery._id),
      delivery: {
        id: delivery._id,
        name: delivery.name,
        email: delivery.email,
        phone: delivery.phone,
        isAvailable: delivery.isAvailable,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body;

    const delivery = await Delivery.findOne({ email });

    if (!delivery) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      password,
      delivery.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      token: generateToken(delivery._id),
      delivery,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.delivery._id,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerDelivery,
  loginDelivery,
  getAssignedOrders,
};
