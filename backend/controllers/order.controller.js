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
            paymentDetails,
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
                return res.status(400).json({
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

        // Process payment details securely
        const enhancedPaymentDetails = {
            transactionId: `TXN-${Date.now()}-${Math.floor(
                Math.random() * 10000
            )}`,
            paymentTime: new Date(),
            method: paymentMethod,
            securityFingerprint: paymentDetails?.securityFingerprint || null,
        };

        // Process method-specific payment details
        if (paymentMethod === "card" && paymentDetails?.card) {
            enhancedPaymentDetails.card = {
                last4: paymentDetails.card.last4 || "",
                brand: paymentDetails.card.brand || "",
                expiryMonth: paymentDetails.card.expiryMonth || "",
                expiryYear: paymentDetails.card.expiryYear || "",
                holderName: paymentDetails.card.holderName || "",
            };
        } else if (
            paymentMethod === "bank_transfer" &&
            paymentDetails?.bankTransfer
        ) {
            enhancedPaymentDetails.bankTransfer = {
                bankName: paymentDetails.bankTransfer.bankName || "",
                accountName: paymentDetails.bankTransfer.accountName || "",
                referenceNumber:
                    paymentDetails.bankTransfer.referenceNumber || "",
            };
        }

        // Create initial timeline entry
        const initialTimeline = [
            {
                status: "created",
                timestamp: new Date(),
                note: "Order placed successfully",
            },
        ];

        // Create the order with enhanced data
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
                req.body.paymentStatus ||
                (paymentMethod === "pay_on_pickup" ? "pending" : "completed"),
            paymentDetails: enhancedPaymentDetails,
            timeline: initialTimeline,
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

        // Add a new timeline entry for this status change
        const timelineEntry = {
            timestamp: new Date(),
            note: `Status updated by admin`,
        };

        if (orderStatus) {
            // Special handling for order cancellation by admin
            if (orderStatus === "cancelled") {
                // If payment was completed, automatically mark as refunded
                if (order.paymentStatus === "completed" && !paymentStatus) {
                    order.paymentStatus = "refunded";
                    timelineEntry.status = "order_cancelled_payment_refunded";
                    timelineEntry.note =
                        "Order cancelled by admin and payment automatically refunded";

                    // Add a separate refund entry for clear tracking
                    order.timeline.push({
                        status: "payment_refunded",
                        timestamp: new Date(),
                        note: `Payment refunded due to order cancellation by admin`,
                    });

                    // Restore the product stock
                    for (const item of order.items) {
                        await Product.findByIdAndUpdate(item.product, {
                            $inc: { stock: item.quantity },
                        });
                    }
                } else {
                    timelineEntry.status = "order_cancelled";
                    timelineEntry.note = "Order cancelled by admin";

                    // Restore the product stock
                    for (const item of order.items) {
                        await Product.findByIdAndUpdate(item.product, {
                            $inc: { stock: item.quantity },
                        });
                    }
                }
            } else {
                timelineEntry.status = `order_${orderStatus}`;
                timelineEntry.note = `Order status updated to ${orderStatus}`;
            }

            order.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
            timelineEntry.status = `payment_${paymentStatus}`;
            timelineEntry.note = `Payment status updated to ${paymentStatus}`;
        }

        // Add the timeline entry
        order.timeline.push(timelineEntry);

        await order.save();

        // Get fully populated order to return
        const updatedOrder = await Order.findById(orderId)
            .populate({
                path: "items.product",
                select: "modelNo description image",
            })
            .populate({
                path: "user",
                select: "fname lname email phone",
            });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User: Cancel an order
export const cancelOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Only allow cancellation if order is in processing state
        if (order.orderStatus !== "processing") {
            return res.status(400).json({
                message:
                    "Cannot cancel this order as it is already being processed for delivery",
            });
        }

        // Update order status to cancelled
        order.orderStatus = "cancelled";

        // If payment was completed, mark as refunded
        if (order.paymentStatus === "completed") {
            order.paymentStatus = "refunded";
        }

        // Add a timeline entry for cancellation
        order.timeline.push({
            status: "cancelled",
            timestamp: new Date(),
            note: "Order cancelled by customer",
        });

        await order.save();

        // Restore the product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        const updatedOrder = await Order.findById(orderId).populate({
            path: "items.product",
            select: "modelNo description image",
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error cancelling order:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Validate payment information (for security checks)
export const validatePayment = async (req, res) => {
    try {
        const { paymentMethod, paymentData } = req.body;

        // This would connect to a payment processor in a real app
        // Here we'll simulate validation with basic checks

        if (paymentMethod === "card") {
            // Validate card information
            if (
                !paymentData.cardNumber ||
                !paymentData.expiryDate ||
                !paymentData.cvv
            ) {
                return res.status(400).json({
                    valid: false,
                    message: "Missing required card information",
                });
            }

            // Simulate card validation (in real app, this would use a payment processor's API)
            const isValid = validateCardFormat(paymentData);

            if (!isValid) {
                return res.status(400).json({
                    valid: false,
                    message: "Invalid card information",
                });
            }
        } else if (paymentMethod === "bank_transfer") {
            // Validate bank transfer information
            if (!paymentData.bankName || !paymentData.accountName) {
                return res.status(400).json({
                    valid: false,
                    message: "Missing required bank information",
                });
            }
        } else {
            return res.status(400).json({
                valid: false,
                message: "Invalid payment method",
            });
        }

        // Return successful validation
        res.status(200).json({
            valid: true,
            message: "Payment information validated successfully",
            transactionId: `TXN-${Date.now()}-${Math.floor(
                Math.random() * 10000
            )}`,
        });
    } catch (error) {
        console.error("Payment validation error:", error.message);
        res.status(500).json({
            valid: false,
            message: "Payment validation error",
        });
    }
};

// Admin: Get order payment details
export const getOrderPaymentDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .select("paymentMethod paymentStatus paymentDetails timeline")
            .populate({
                path: "user",
                select: "fname lname email phone",
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            orderId: order._id,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            paymentDetails: order.paymentDetails,
            timeline: order.timeline, // Return the complete timeline without filtering
            user: order.user,
        });
    } catch (error) {
        console.error("Error fetching payment details:", error.message);
        res.status(500).json({ message: "Failed to retrieve payment details" });
    }
};

// Helper function for card validation
function validateCardFormat(cardData) {
    // Check card number format (16 digits)
    if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
        return false;
    }

    // Check expiry date format (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
        return false;
    }

    // Check CVV format (3-4 digits)
    if (!/^\d{3,4}$/.test(cardData.cvv)) {
        return false;
    }

    // Card is valid format
    return true;
}
