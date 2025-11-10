import express from "express";
const router = express.Router();
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
  getAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderToDelivered,
  getAllReviews,
  updateReview,
} from "../controllers/admin.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

// All routes in this file are protected and for admins only
router.use(protect);
router.use(admin);

// --- Dashboard Route ---
router.route("/stats").get(getDashboardStats);

// --- User Routes ---
router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser).get(getUserById).put(updateUser);

// --- Product Routes ---
router
  .route("/products")
  .get(getAllProductsForAdmin) // 2. Add the GET route
  .post(createProduct);

router.route("/products/:id").put(updateProduct).delete(deleteProduct);

// --- Order Routes ---
router.route("/orders").get(getAllOrders);
router.route("/orders/:id/deliver").put(updateOrderToDelivered);

// --- Review Routes ---
router.route("/reviews").get(getAllReviews); // 3. Add GET route
router.route("/reviews/:id").put(updateReview);

export default router;
