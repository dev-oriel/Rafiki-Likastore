import express from "express";
const router = express.Router();
import {
  createReview,
  getFeaturedReviews,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.route("/").post(protect, createReview);
router.route("/featured").get(getFeaturedReviews);

export default router;
