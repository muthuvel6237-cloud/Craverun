const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const connectDB = require("./config/db");

const app = express();

connectDB();

const allowedOrigins = (process.env.CLIENT_URLS || "http://127.0.0.1:5173,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://127.0.0.1:5174", "http://localhost:5174");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.send("CraveRun Backend Running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "CraveRun API",
    time: new Date().toISOString(),
  });
});

const frontendBuild = path.join(__dirname, "public");
app.use(express.static(frontendBuild));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
    return res.sendFile(path.join(frontendBuild, "index.html"));
  }
  return next();
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

module.exports = app;
