import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
  updateUserPaymentMethods,
  toggleFavorite,
  googleLogin, // 1. Import
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/auth/google", googleLogin);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/profile/addresses").put(protect, updateUserAddresses);
router.route("/profile/payment-methods").put(protect, updateUserPaymentMethods);
router.route("/profile/favorites").put(protect, toggleFavorite);

export default router;
