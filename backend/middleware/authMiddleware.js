const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Owner = require("../models/Owner");
const Delivery = require("../models/Delivery");

const protectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const protectOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = await Owner.findById(decoded.id).select("-password");

    if (!req.owner) {
      return res.status(401).json({ message: "Owner not found" });
    }

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const protectDelivery = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.delivery = await Delivery.findById(decoded.id).select("-password");

    if (!req.delivery) {
      return res.status(401).json({ message: "Delivery partner not found" });
    }

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protectUser, protectOwner, protectDelivery };
