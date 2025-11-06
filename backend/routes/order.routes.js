import express from "express";
const router = express.Router();
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid); // Note: This might be triggered by your payment callback instead

export default router;
