import express from "express";
import upload from "../config/multer.config.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private
router.post("/", protect, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }

  // Multer adds a 'file' object to the 'req' object.
  // We return the path to the frontend.
  // Note: We add a leading slash for the correct path.
  res.status(200).json({
    message: "File uploaded successfully",
    // This path will be saved in the DB (e.g., /uploads/avatar-123456789.png)
    path: `/${req.file.path.replace(/\\/g, "/").split("backend/")[1]}`,
  });
});

export default router;
