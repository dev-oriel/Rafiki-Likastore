import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  getProductMeta,
} from "../controllers/product.controller.js";

router.get("/meta", getProductMeta);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
