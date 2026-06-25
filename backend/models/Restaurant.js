const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    image: {
      type: String,
    },

    cuisine: {
      type: String,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    isHoliday: {
      type: Boolean,
      default: false,
    },

    holidayReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);