const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOwnerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protectUser,
  protectOwner,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protectUser, createOrder);
router.get("/my-orders", protectUser, getMyOrders);
router.get("/owner", protectOwner, getOwnerOrders);
router.put("/:id/status", protectOwner, updateOrderStatus);

module.exports = router;