import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getDiscountedProducts,
    getProductsByCategory,
    getSingleProduct,
    toggleDiscountedProduct,
    updateProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/discounted-products", getDiscountedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getSingleProduct);

router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleDiscountedProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
