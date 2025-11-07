import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

// These are public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
