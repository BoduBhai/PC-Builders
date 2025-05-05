import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(
        `refreshToken:${userId}`,
        refreshToken,
        "EX",
        60 * 60 * 24 * 7
    );
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const signup = async (req, res) => {
    const { email, fname, lname, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            email,
            fname,
            lname,
            password,
            phone,
        });

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            phone: user.phone,
            profilePicture: user.profilePicture,
            address: user.address,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                _id: user._id,
                email: user.email,
                fname: user.fname,
                lname: user.lname,
                phone: user.phone,
                profilePicture: user.profilePicture,
                address: user.address,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            await redis.del(`refreshToken:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const updateData = { ...req.body };

        const currentUser = await User.findById(id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Handle profile picture upload
        if (
            updateData.profilePicture &&
            updateData.profilePicture.startsWith("data:image")
        ) {
            if (
                currentUser.profilePicture &&
                currentUser.profilePicture.includes("cloudinary")
            ) {
                try {
                    const urlParts = currentUser.profilePicture.split("/");
                    const fileName = urlParts[urlParts.length - 1];
                    const folderName = urlParts[urlParts.length - 2];
                    const publicId = `${folderName}/${fileName.split(".")[0]}`;

                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudinaryError) {
                    console.log(
                        "Error deleting old profile image:",
                        cloudinaryError
                    );
                }
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(
                updateData.profilePicture,
                {
                    folder: "users",
                }
            );

            updateData.profilePicture = cloudinaryResponse.secure_url;
        }

        // Handle address updates properly to avoid conflicts
        if (updateData.address) {
            // If address is a string, it's probably intended as the street address
            if (typeof updateData.address === "string") {
                // Create complete address object with only street updated
                updateData.address = {
                    street: updateData.address,
                    city: currentUser.address?.city || "",
                    state: currentUser.address?.state || "",
                    zipCode: currentUser.address?.zipCode || "",
                    country: currentUser.address?.country || "",
                };
            } else if (typeof updateData.address === "object") {
                // If it's an object with partial fields, merge with current address
                updateData.address = {
                    street:
                        updateData.address.street ||
                        currentUser.address?.street ||
                        "",
                    city:
                        updateData.address.city ||
                        currentUser.address?.city ||
                        "",
                    state:
                        updateData.address.state ||
                        currentUser.address?.state ||
                        "",
                    zipCode:
                        updateData.address.zipCode ||
                        currentUser.address?.zipCode ||
                        "",
                    country:
                        updateData.address.country ||
                        currentUser.address?.country ||
                        "",
                };
            }
        }

        // Handle individual address field updates
        const addressFields = [
            "address.street",
            "address.city",
            "address.state",
            "address.zipCode",
            "address.country",
        ];
        for (const field of addressFields) {
            if (field in updateData) {
                // If individual address fields are being updated, make sure we're not also updating the whole address
                if (updateData.address) {
                    delete updateData[field]; // Remove individual field as we're updating the whole object
                }
            }
        }

        // Handle structured phone update
        if (updateData.phone) {
            const phoneExists = await User.findOne({
                phone: updateData.phone,
                _id: { $ne: id },
            });

            if (phoneExists) {
                return res.status(400).json({
                    message:
                        "Phone number already registered with another account",
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        req.user = user;
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateProfile:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!(await user.comparePassword(currentPassword))) {
            return res
                .status(400)
                .json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();
        await redis.del(`refreshToken:${id}`);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        const { accessToken, refreshToken } = generateToken(id);
        await storeRefreshToken(id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const tokenRefresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "No refresh Token provided" });
        }
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
        if (storedToken != refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token refreshed successfully" });
    } catch (error) {
        console.log("Error in tokenRefresh:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getProfile:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
