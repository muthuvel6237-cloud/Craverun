const Order = require("../models/Order");
const Food = require("../models/Food");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod,
      discountAmount = 0,
      paymentStatus,
      paymentReference = "",
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    let totalAmount = 0;
    const orderItems = [];
    let restaurantId = null;
    let ownerId = null;

    for (const item of items) {
      const food = await Food.findById(item.foodId);

      if (!food) {
        return res.status(404).json({
          message: "Food not found",
        });
      }

      const quantity = item.quantity || 1;

      restaurantId = food.restaurant;
      ownerId = food.owner;

      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
      });

      totalAmount += food.price * quantity;
    }

    const safeDiscount = Math.max(Number(discountAmount) || 0, 0);
    const finalAmount = Math.max(totalAmount - safeDiscount, 0);
    const ownerCommissionRate = 10;
    const platformCommissionAmount = Math.round((finalAmount * ownerCommissionRate) / 100);
    const ownerPayoutAmount = Math.max(finalAmount - platformCommissionAmount, 0);

    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurantId,
      owner: ownerId,
      items: orderItems,
      totalAmount,
      discountAmount: safeDiscount,
      finalAmount,
      ownerCommissionRate,
      platformCommissionAmount,
      ownerPayoutAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || (paymentMethod === "COD" ? "Pending" : "Paid"),
      paymentReference,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("restaurant", "name address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      owner: req.owner._id,
    })
      .populate("customer", "name email phone")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      owner: req.owner._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOwnerOrders,
  updateOrderStatus,
};
