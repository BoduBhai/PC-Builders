import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            total,
        } = req.body;

        // Get user and their cart
        const user = await User.findById(userId).populate({
            path: "cartItems.product",
            select: "modelNo description price stock onDiscount discountPrice",
        });

        // Verify cart is not empty
        if (!user.cartItems || user.cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Check product stock availability and prepare order items
        const orderItems = [];
        for (const item of user.cartItems) {
            const product = item.product;

            // Check if product exists and has enough stock
            if (!product) {
                return res
                    .status(400)
                    .json({
                        message:
                            "One or more products in your cart are no longer available",
                    });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.modelNo}. Only ${product.stock} available.`,
                });
            }

            // Calculate the price (considering any discounts)
            const price = product.onDiscount
                ? product.discountPrice
                : product.price;

            // Add to order items
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: price,
            });

            // Update product stock
            await Product.findByIdAndUpdate(product._id, {
                $inc: { stock: -item.quantity },
            });
        }

        // Create the order
        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            tax,
            shipping,
            total,
            paymentStatus:
                paymentMethod === "bank_transfer" ? "pending" : "completed",
            paymentDetails: {
                transactionId: `TXN-${Date.now()}-${Math.floor(
                    Math.random() * 1000
                )}`,
                paymentTime: new Date(),
            },
        });

        // Clear the user's cart
        user.cartItems = [];
        await user.save();

        // Clear Redis cache for the user's cart
        await redis.set(
            `cart:${userId}`,
            JSON.stringify({
                items: [],
                totalPrice: 0,
                totalItems: 0,
            }),
            "EX",
            3600
        );

        // Return the created order
        const populatedOrder = await Order.findById(order._id)
            .populate({
                path: "items.product",
                select: "modelNo description image",
            })
            .populate({
                path: "user",
                select: "fname lname email phone",
            });

        res.status(201).json(populatedOrder);
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all orders for the logged-in user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate({
                path: "items.product",
                select: "modelNo description image",
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate({
                path: "items.product",
                select: "modelNo description image",
            })
            .populate({
                path: "user",
                select: "fname lname email phone",
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order details:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "items.product",
                select: "modelNo description image",
            })
            .populate({
                path: "user",
                select: "fname lname email phone",
            })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
