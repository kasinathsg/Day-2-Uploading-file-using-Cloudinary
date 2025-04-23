const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const Url = require("../models/Url");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      uploadStream.end(req.file.buffer);
    });

    await Url.create({ url: result.secure_url });
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

module.exports = router;