import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rafiki-products", // The folder in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    // --- CONSISTENCY & SPEED MAGIC ---
    // 1. Resize to a standard max width (e.g., 800px)
    // 2. 'limit' ensures we don't upscale small images
    // 3. 'f_auto' automatically serves WebP to Chrome/Edge (much faster)
    // 4. 'q_auto' automatically adjusts quality to save bytes without losing visual quality
    transformation: [
      { width: 800, height: 800, crop: "limit", gravity: "center" },
    ],
    format: "auto", // Use modern formats (AVIF/WebP) automatically
  },
});

const upload = multer({ storage: storage });

export default upload;
