import express from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    toggleRole,
} from "../controllers/admin.controller.js";
import { getAdminAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// Specific routes first
router.get("/analytics", protectRoute, adminRoute, getAdminAnalytics);
router.get("/all-users", protectRoute, adminRoute, getAllUsers);

// Parameter routes last
router.get("/:id", protectRoute, adminRoute, getUserById);
router.post("/toggle-role/:id", protectRoute, adminRoute, toggleRole);
router.delete("/:id", protectRoute, adminRoute, deleteUser);

export default router;

// till now the ui is good. now look at whole of my project. I don't have anything set up of analytics in my database I guess
