import express from "express";
import upload from "../config/multer.config.js";
import { protect, admin } from "../middleware/auth.middleware.js"; // Ensure admins only

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload a file to Cloudinary
// @access  Private/Admin
router.post("/", protect, admin, upload.single("avatar"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file" });
    }

    // Cloudinary automatically returns the secure URL in `req.file.path`
    res.status(200).json({
      message: "Image uploaded successfully",
      path: req.file.path, // This is now a full URL (https://res.cloudinary.com/...)
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
