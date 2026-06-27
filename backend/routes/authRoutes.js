const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { sendOtp } = require("../controllers/otpController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/:accountType/:purpose/send-otp", sendOtp);

module.exports = router;
