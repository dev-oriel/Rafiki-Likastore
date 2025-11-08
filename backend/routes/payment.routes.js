import express from "express";
const router = express.Router();
import {
  initiateSTKPush,
  mpesaCallback,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/stkpush", protect, initiateSTKPush);

// 1. Add :orderId to the callback route
router.post("/mpesa/callback/:orderId", mpesaCallback);

export default router;
