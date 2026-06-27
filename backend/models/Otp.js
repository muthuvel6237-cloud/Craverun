const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, index: true },
    accountType: {
      type: String,
      required: true,
      enum: ["customer", "owner", "delivery"],
    },
    purpose: { type: String, required: true, enum: ["login", "register"] },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpSchema.index({ phone: 1, accountType: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("Otp", otpSchema);
