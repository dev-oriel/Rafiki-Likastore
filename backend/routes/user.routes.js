import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUSers,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/", getUSers)

export default router;
