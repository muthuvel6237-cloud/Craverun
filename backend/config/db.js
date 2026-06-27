const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to backend/.env");
    }

    const dnsServers = (process.env.DNS_SERVERS || "")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    if (dnsServers.length) {
      dns.setServers(dnsServers);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    // Upgrade email indexes created by the old password-based account schemas.
    for (const collectionName of ["users", "owners", "deliveries"]) {
      const collection = mongoose.connection.collection(collectionName);
      const indexes = await collection.indexes().catch(() => []);
      const emailIndex = indexes.find((index) => index.name === "email_1");
      if (emailIndex && !emailIndex.sparse) await collection.dropIndex("email_1");
      await collection.createIndex({ email: 1 }, { unique: true, sparse: true, name: "email_1" });
    }
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
