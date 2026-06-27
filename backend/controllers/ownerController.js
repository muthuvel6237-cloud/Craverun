const jwt = require("jsonwebtoken");
const { normalizePhone, verifyOtp } = require("../services/otpService");

const Owner = require("../models/Owner");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const Order = require("../models/Order");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerOwner = async (req, res) => {
  try {
    const { name, email, otp } = req.body;
    const phone = normalizePhone(req.body.phone);
    if (!name?.trim() || !phone) return res.status(400).json({ message: "Name and valid mobile number are required" });
    const existingOwner = await Owner.findOne({ phone });

    if (existingOwner) {
      return res.status(400).json({ message: "Owner already exists" });
    }

    if (!(await verifyOtp({ phone, accountType: "owner", purpose: "register", code: otp }))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const owner = await Owner.create({
      name: name.trim(),
      email: email?.trim().toLowerCase() || undefined,
      phone,
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
    const phone = normalizePhone(req.body.phone);
    const owner = phone ? await Owner.findOne({ phone }) : null;

    if (!owner) {
      return res.status(400).json({ message: "Account not found" });
    }

    if (!(await verifyOtp({ phone, accountType: "owner", purpose: "login", code: req.body.otp }))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
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
