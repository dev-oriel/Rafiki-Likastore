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
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // No admin needed here

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/profile/addresses").put(protect, updateUserAddresses);
router.route("/profile/payment-methods").put(protect, updateUserPaymentMethods);

export default router;
