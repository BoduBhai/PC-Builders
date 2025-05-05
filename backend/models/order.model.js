import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        shippingAddress: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            zipCode: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
                default: "Bangladesh",
            },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["card", "bank_transfer", "pay_on_pickup"],
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ["processing", "shipped", "delivered", "cancelled"],
            default: "processing",
        },
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        shipping: {
            type: Number,
            required: true,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        paymentDetails: {
            transactionId: String,
            paymentTime: Date,
            securityFingerprint: String,
            method: String,
            card: {
                last4: String,
                brand: String,
                expiryMonth: String,
                expiryYear: String,
                holderName: String,
            },
            bankTransfer: {
                bankName: String,
                accountName: String,
                referenceNumber: String,
            },
        },
        timeline: [
            {
                status: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                note: String,
            },
        ],
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
