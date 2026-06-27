const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { normalizePhone, verifyOtp } = require("../services/otpService");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, otp } = req.body;
    const phone = normalizePhone(req.body.phone);
    if (!name?.trim() || !phone) return res.status(400).json({ message: "Name and valid mobile number are required" });
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    if (!(await verifyOtp({ phone, accountType: "customer", purpose: "register", code: otp }))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email?.trim().toLowerCase() || undefined,
      phone,
    });

    res.status(201).json({
      message: "Customer registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const user = phone ? await User.findOne({ phone }) : null;

    if (!user) {
      return res.status(400).json({ message: "Account not found" });
    }

    if (!(await verifyOtp({ phone, accountType: "customer", purpose: "login", code: req.body.otp }))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({
      message: "Customer login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
