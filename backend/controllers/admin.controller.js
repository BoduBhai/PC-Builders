import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select(
            "id email fname lname phone profilePicture role createdAt"
        );
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select(
            "id email fname lname phone profilePicture role createdAt"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserById:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const toggleRole = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (id === req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot change your own role",
            });
        }

        if (user.role === "superadmin") {
            return res.status(403).json({
                message: "You cannot change the role of a Super Admin",
            });
        }

        user.role = user.role === "admin" ? "customer" : "admin";
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in toggleRole:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (id === req.user._id.toString()) {
        return res.status(403).json({
            message: "You cannot delete your own account",
        });
    }

    try {
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUserRole = req.user.role;

        if (userToDelete.role === "superadmin") {
            return res.status(403).json({
                message: "You cannot delete a Super Admin account",
            });
        }
        if (userToDelete.role === "admin" && currentUserRole !== "superadmin") {
            return res.status(403).json({
                message: "Only superadmin can delete admin accounts",
            });
        }

        if (userToDelete.profilePicture) {
            const publicId = userToDelete.profilePicture
                .split("/")
                .pop()
                .split(".")[0];
            try {
                await cloudinary.uploader.destroy(`users/${publicId}`);
                console.log("Image deleted from Cloudinary successfully");
            } catch (error) {
                console.error(
                    "Error deleting image from Cloudinary:",
                    error.message
                );
            }
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUser:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
