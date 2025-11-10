import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  getProductMeta,
  getOnSaleProducts,
  getPopularProducts,
  getStudentFavorites, // 1. Import
} from "../controllers/product.controller.js";

router.get("/meta", getProductMeta);
router.get("/offers", getOnSaleProducts);
router.get("/popular", getPopularProducts);
router.get("/favorites", getStudentFavorites); // 2. Add new route
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
