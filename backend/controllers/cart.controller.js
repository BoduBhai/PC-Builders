import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

// Helper function to calculate cart totals
const calculateCartTotals = (cartItems) => {
    let totalPrice = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
        const itemPrice = item.product.onDiscount
            ? item.product.discountPrice
            : item.product.price;

        totalPrice += itemPrice * item.quantity;
        totalItems += item.quantity;
    });

    return {
        items: cartItems,
        totalPrice,
        totalItems,
    };
};

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Try to get from Redis cache first
        const cachedCart = await redis.get(`cart:${userId}`);

        if (cachedCart) {
            return res.status(200).json(JSON.parse(cachedCart));
        }

        // If not in cache, fetch from database
        const user = await User.findById(userId).populate({
            path: "cartItems.product",
            select: "modelNo description price image category stock brand onDiscount discountPrice",
        });

        if (!user || !user.cartItems) {
            const emptyCart = { items: [], totalPrice: 0, totalItems: 0 };
            // Cache empty cart
            await redis.set(
                `cart:${userId}`,
                JSON.stringify(emptyCart),
                "EX",
                3600
            ); // expires in 1 hour
            return res.status(200).json(emptyCart);
        }

        // Calculate cart totals
        const cart = calculateCartTotals(user.cartItems);

        // Cache the cart
        await redis.set(`cart:${userId}`, JSON.stringify(cart), "EX", 3600); // expires in 1 hour

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        // Validate product exists and is in stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res
                .status(400)
                .json({ message: "Not enough stock available" });
        }

        // Find user and their cart
        const user = await User.findById(userId);

        // Check if product already exists in cart
        const existingItemIndex = user.cartItems.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            const newQuantity =
                user.cartItems[existingItemIndex].quantity + quantity;

            // Check if new quantity exceeds stock
            if (newQuantity > product.stock) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Cannot add more of this item (stock limit reached)",
                    });
            }

            user.cartItems[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            user.cartItems.push({
                product: productId,
                quantity,
            });
        }

        // Save updated cart
        await user.save();

        // Return updated cart data with product details
        const updatedUser = await User.findById(userId).populate({
            path: "cartItems.product",
            select: "modelNo description price image category stock brand onDiscount discountPrice",
        });

        // Calculate cart totals
        const cart = calculateCartTotals(updatedUser.cartItems);

        // Update Redis cache
        await redis.set(`cart:${userId}`, JSON.stringify(cart), "EX", 3600);

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined || quantity < 1) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Validate product exists and check stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (quantity > product.stock) {
            return res
                .status(400)
                .json({
                    message: "Requested quantity exceeds available stock",
                });
        }

        // Find user and update cart item
        const user = await User.findById(userId);
        const cartItemIndex = user.cartItems.findIndex(
            (item) => item.product.toString() === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Update quantity
        user.cartItems[cartItemIndex].quantity = quantity;
        await user.save();

        // Return updated cart
        const updatedUser = await User.findById(userId).populate({
            path: "cartItems.product",
            select: "modelNo description price image category stock brand onDiscount discountPrice",
        });

        // Calculate cart totals
        const cart = calculateCartTotals(updatedUser.cartItems);

        // Update Redis cache
        await redis.set(`cart:${userId}`, JSON.stringify(cart), "EX", 3600);

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating cart item:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Find user and remove item from cart
        const user = await User.findById(userId);

        // Filter out the item to remove
        user.cartItems = user.cartItems.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        // Return updated cart
        const updatedUser = await User.findById(userId).populate({
            path: "cartItems.product",
            select: "modelNo description price image category stock brand onDiscount discountPrice",
        });

        // Calculate cart totals
        const cart = calculateCartTotals(updatedUser.cartItems);

        // Update Redis cache
        await redis.set(`cart:${userId}`, JSON.stringify(cart), "EX", 3600);

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing cart item:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Clear the entire cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find user and clear cart
        const user = await User.findById(userId);
        user.cartItems = [];
        await user.save();

        // Empty cart object
        const emptyCart = { items: [], totalPrice: 0, totalItems: 0 };

        // Update Redis cache
        await redis.set(
            `cart:${userId}`,
            JSON.stringify(emptyCart),
            "EX",
            3600
        );

        res.status(200).json(emptyCart);
    } catch (error) {
        console.error("Error clearing cart:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
