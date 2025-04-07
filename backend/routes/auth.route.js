import express from "express";
import {
    login,
    logout,
    signup,
    tokenRefresh,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.post("/change-password", protectRoute, changePassword);

router.post("/refresh-token", tokenRefresh);
router.get("/profile", protectRoute, getProfile);

export default router;
