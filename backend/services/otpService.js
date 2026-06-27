const crypto = require("crypto");
const Otp = require("../models/Otp");

const normalizePhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(phone) ? phone : null;
};

const hashCode = (phone, code) =>
  crypto.createHash("sha256").update(`${phone}:${code}:${process.env.JWT_SECRET}`).digest("hex");

const createOtp = async ({ phone, accountType, purpose }) => {
  const code = String(crypto.randomInt(100000, 1000000));
  await Otp.findOneAndUpdate(
    { phone, accountType, purpose },
    {
      codeHash: hashCode(phone, code),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // SMS providers can be connected here for production. Never log the code in production.
  if (process.env.NODE_ENV !== "production") console.log(`CraveRun OTP for ${phone}: ${code}`);
  return code;
};

const verifyOtp = async ({ phone, accountType, purpose, code }) => {
  const record = await Otp.findOne({ phone, accountType, purpose });
  if (!record || record.expiresAt <= new Date() || record.attempts >= 5) return false;

  const supplied = Buffer.from(hashCode(phone, String(code || "")));
  const expected = Buffer.from(record.codeHash);
  const valid = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    return false;
  }

  await record.deleteOne();
  return true;
};

module.exports = { normalizePhone, createOtp, verifyOtp };
