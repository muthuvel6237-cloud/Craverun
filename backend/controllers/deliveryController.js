const jwt = require("jsonwebtoken");
const { normalizePhone, verifyOtp } = require("../services/otpService");

const Delivery = require("../models/Delivery");
const Order = require("../models/Order");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerDelivery = async (req, res) => {
  try {
    const { name, email, otp } = req.body;
    const phone = normalizePhone(req.body.phone);
    if (!name?.trim() || !phone) return res.status(400).json({ message: "Name and valid mobile number are required" });
    const existingDelivery = await Delivery.findOne({ phone });

    if (existingDelivery) {
      return res.status(400).json({ message: "Delivery partner already exists" });
    }

    if (!(await verifyOtp({ phone, accountType: "delivery", purpose: "register", code: otp }))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const delivery = await Delivery.create({
      name: name.trim(),
      email: email?.trim().toLowerCase() || undefined,
      phone,
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
    const phone = normalizePhone(req.body.phone);
    const delivery = phone ? await Delivery.findOne({ phone }) : null;

    if (!delivery) {
      return res.status(400).json({
        message: "Account not found",
      });
    }

    if (!(await verifyOtp({ phone, accountType: "delivery", purpose: "login", code: req.body.otp }))) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
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
