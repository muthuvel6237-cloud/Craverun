const User = require("../models/User");
const Owner = require("../models/Owner");
const Delivery = require("../models/Delivery");
const { normalizePhone, createOtp } = require("../services/otpService");

const models = { customer: User, owner: Owner, delivery: Delivery };

const sendOtp = async (req, res) => {
  try {
    const { accountType, purpose } = req.params;
    const phone = normalizePhone(req.body.phone);
    const Model = models[accountType];
    if (!Model || !["login", "register"].includes(purpose)) {
      return res.status(400).json({ message: "Invalid OTP request" });
    }
    if (!phone) return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });

    const exists = await Model.exists({ phone });
    if (purpose === "login" && !exists) {
      return res.status(404).json({ message: "No account found. Please register first." });
    }
    if (purpose === "register" && exists) {
      return res.status(409).json({ message: "This mobile number is already registered. Please login." });
    }

    const code = await createOtp({ phone, accountType, purpose });
    const payload = { message: "OTP sent successfully", expiresIn: 300 };
    if (process.env.NODE_ENV !== "production" || process.env.OTP_EXPOSE_IN_RESPONSE === "true") {
      payload.devOtp = code;
    }
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendOtp };
