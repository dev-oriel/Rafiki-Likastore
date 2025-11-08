import express from "express";
const router = express.Router();
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrderPaymentStatus,
  updateOrderToPaid,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

// These routes are for logged-in users
router.route("/").post(protect, createOrder);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/status").get(protect, getOrderPaymentStatus);

export default router;
