const express = require("express");

const {
  registerDelivery,
  loginDelivery,
  getAssignedOrders,
} = require("../controllers/deliveryController");
const { protectDelivery } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerDelivery);
router.post("/login", loginDelivery);

router.get(
  "/orders",
  protectDelivery,
  getAssignedOrders
);

module.exports = router;
