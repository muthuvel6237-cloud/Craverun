const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: undefined,
    },

    role: {
      type: String,
      default: "owner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
