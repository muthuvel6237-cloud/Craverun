const express = require("express");

const {
  registerOwner,
  loginOwner,
  getOwnerDashboard,
} = require("../controllers/ownerController");

const { protectOwner } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.get("/dashboard", protectOwner, getOwnerDashboard);

module.exports = router;