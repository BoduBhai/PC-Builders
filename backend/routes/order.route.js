import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protectRoute);

// User routes
router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);

// Admin routes
router.get("/admin/all", adminRoute, getAllOrders);
router.get("/admin/:orderId", adminRoute, getOrderById);
router.patch("/admin/:orderId/status", adminRoute, updateOrderStatus);

export default router;
