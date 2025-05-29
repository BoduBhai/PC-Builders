import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDiscountedProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        if (!page || !limit) {
            let discountedProducts = await redis.get("discountedProducts");

            if (discountedProducts) {
                return res.status(200).json(JSON.parse(discountedProducts));
            }
            discountedProducts = await Product.find({
                onDiscount: true,
            }).lean();

            // Return empty array with 200 status instead of 404 when no products found
            if (!discountedProducts || discountedProducts.length === 0) {
                return res.status(200).json([]);
            }

            await redis.set(
                "discountedProducts",
                JSON.stringify(discountedProducts)
            );

            return res.status(200).json(discountedProducts);
        }

        const skip = (page - 1) * limit;

        const total = await Product.countDocuments({ onDiscount: true });

        const products = await Product.find({ onDiscount: true })
            .skip(skip)
            .limit(limit)
            .lean();
        if (!products || products.length === 0) {
            return res.status(200).json({
                message: "No discounted products found for this page",
                products: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
            });
        }

        res.status(200).json({
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {
            modelNo,
            price,
            description,
            image,
            brand,
            category,
            stock,
            color,
        } = req.body;

        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products",
            });
        }

        const product = await Product.create({
            modelNo,
            price,
            description,
            image: cloudinaryResponse?.secure_url
                ? cloudinaryResponse.secure_url
                : "",
            category,
            stock,
            brand: brand || "Unknown",
            color: color || "Unknown",
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update Redis cache for discounted products
        await updatedDiscountedProductCache();

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.error(
                    "Error deleting image from Cloudinary:",
                    error.message
                );
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        // Update Redis cache for discounted products
        await updatedDiscountedProductCache();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function updatedDiscountedProductCache() {
    try {
        const discountedProducts = await Product.find({
            onDiscount: true,
        }).lean();
        await redis.set(
            "discountedProducts",
            JSON.stringify(discountedProducts)
        );
    } catch (error) {
        console.log("Error updating discounted products cache:", error.message);
    }
}

export const toggleDiscountedProduct = async (req, res) => {
    try {
        const { discountPrice, discountStartDate, discountEndDate } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.onDiscount = !product.onDiscount;

            if (product.onDiscount) {
                product.discountPrice = Number(discountPrice);

                product.discountStartDate = discountStartDate
                    ? new Date(discountStartDate)
                    : new Date();

                if (discountEndDate) {
                    product.discountEndDate = new Date(discountEndDate);
                } else {
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 1);
                    product.discountEndDate = endDate;
                }
            } else {
                product.discountPrice = 0;
                product.discountStartDate = null;
                product.discountEndDate = null;
            }

            const updatedProduct = await product.save();

            await updatedDiscountedProductCache();
            res.status(200).json(updatedProduct);
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error toggling discounted product:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const categoryProducts = await Product.find({
            category: { $regex: new RegExp(`^${category}$`, "i") },
        }).lean();

        if (!categoryProducts || categoryProducts.length === 0) {
            return res.status(404).json({
                message: `No products found in category: ${category}`,
                products: [],
            });
        }

        res.status(200).json({ products: categoryProducts });
    } catch (error) {
        console.error(
            `Error fetching ${req.params.category} products:`,
            error.message
        );
        res.status(500).json({ message: "Internal server error" });
    }
};
