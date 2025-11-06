import express from "express";
const router = express.Router();
import {
  initiateSTKPush,
  mpesaCallback,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.post("/stkpush", protect, initiateSTKPush);
router.post("/callback/:orderId", mpesaCallback); // Publicly accessible

export default router;
