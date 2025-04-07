import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        modelNo: {
            type: String,
            required: [true, "Please enter a model number"],
        },
        description: {
            type: String,
            required: [true, "Please enter a description"],
        },
        price: {
            type: Number,
            min: 0,
            required: [true, "Please enter a price"],
        },
        image: {
            type: String,
            required: [true, "Please upload an image"],
        },
        category: {
            type: String,
            required: [true, "Please select a category"],
        },
        stock: {
            type: Number,
            default: 0,
            required: [true, "Please enter the stock quantity"],
        },
        brand: {
            type: String,
        },
        color: {
            type: String,
        },
        onDiscount: {
            type: Boolean,
            default: false,
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        discountStartDate: {
            type: Date,
        },
        discountEndDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
