import express from "express";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    toggleRole,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/all-users", protectRoute, adminRoute, getAllUsers);
router.get("/:id", protectRoute, adminRoute, getUserById);
router.post("/toggle-role/:id", protectRoute, adminRoute, toggleRole);
router.delete("/:id", protectRoute, adminRoute, deleteUser);

export default router;
