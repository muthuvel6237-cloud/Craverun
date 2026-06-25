const express = require("express");

const {
  createAdmin,
  loginAdmin,
  getAdminDashboard,
  getAllCustomers,
  getAllOwners,
  getAllRestaurants,
  getAllOrders,
} = require("../controllers/adminController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

router.get("/dashboard", protectAdmin, getAdminDashboard);
router.get("/customers", protectAdmin, getAllCustomers);
router.get("/owners", protectAdmin, getAllOwners);
router.get("/restaurants", protectAdmin, getAllRestaurants);
router.get("/orders", protectAdmin, getAllOrders);

module.exports = router;