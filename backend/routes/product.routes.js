import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  getProductMeta,
  getOnSaleProducts, // 1. Import
} from "../controllers/product.controller.js";

router.get("/meta", getProductMeta);
router.get("/offers", getOnSaleProducts); // 2. Add new route
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
