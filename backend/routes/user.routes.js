import express from "express";
const router = express.Router();
import {
  getUSers,
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
  updateUserPaymentMethods,
} from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // Update profile (name, email, etc.)

router.route("/profile/addresses").put(protect, updateUserAddresses); // Update addresses

router.route("/profile/payment-methods").put(protect, updateUserPaymentMethods); // Update payments

// Admin-only route
router.get("/", protect, admin, getUSers);

export default router;
