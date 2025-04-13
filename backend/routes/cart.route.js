import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protectRoute);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/update", updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", removeCartItem);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
