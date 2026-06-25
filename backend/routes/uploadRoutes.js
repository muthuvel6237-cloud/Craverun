const express = require("express");
const upload = require("../config/multer");

const router = express.Router();

router.post("/food-image", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;