import express from "express";
const router = express.Router();
import {
  getDashboardStats, // 1. Import
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderToDelivered,
} from "../controllers/admin.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

// All routes in this file are protected and for admins only
router.use(protect);
router.use(admin);

// --- Dashboard Route ---
router.route("/stats").get(getDashboardStats); // 2. Add new route

// --- User Routes ---
router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser).get(getUserById).put(updateUser);

// --- Product Routes ---
router.route("/products").post(createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct);

// --- Order Routes ---
router.route("/orders").get(getAllOrders);
router.route("/orders/:id/deliver").put(updateOrderToDelivered);

export default router;
