import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

/**
 * Get admin dashboard analytics data
 * This is a demo controller that generates mock data
 * In a real application, you would query your database for real analytics
 */
export const getAdminAnalytics = async (req, res) => {
    try {
        let cachedAnalytics = null;

        // Try to get data from Redis cache, but continue if Redis fails
        try {
            cachedAnalytics = await redis.get("adminAnalytics");
            if (cachedAnalytics) {
                return res.status(200).json(JSON.parse(cachedAnalytics));
            }
        } catch (redisError) {
            console.log(
                "Redis cache error (continuing without cache):",
                redisError.message
            );
            // Continue without using cache
        }

        // Real data counts from database
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // For this demo, we'll generate realistic mock data for the remaining analytics
        // In a real app, you would query your database for these values
        const mockAnalyticsData = {
            totalRevenue: 185642.58,
            totalUsers,
            totalProducts,
            totalOrders: 2347,
            revenueGrowth: 12.5,
            userGrowth: 8.3,
            productGrowth: 5.7,
            orderGrowth: 14.2,
            salesByCategory: [
                { name: "CPU", value: 42500, percentage: 28 },
                { name: "GPU", value: 36750, percentage: 24 },
                { name: "RAM", value: 22800, percentage: 15 },
                { name: "Storage", value: 19750, percentage: 13 },
            ],
            monthlySales: [
                { label: "Jan", value: 15000 },
                { label: "Feb", value: 18500 },
                { label: "Mar", value: 22000 },
                { label: "Apr", value: 19800 },
                { label: "May", value: 24500 },
                { label: "Jun", value: 28900 },
                { label: "Jul", value: 32000 },
                { label: "Aug", value: 35600 },
                { label: "Sep", value: 33400 },
                { label: "Oct", value: 38200 },
                { label: "Nov", value: 42800 },
                { label: "Dec", value: 48000 },
            ],
            recentSales: [
                {
                    orderId: "ORD-5647",
                    customer: "John Doe",
                    date: new Date(),
                    amount: 1299.99,
                },
                {
                    orderId: "ORD-5646",
                    customer: "Alice Smith",
                    date: new Date(Date.now() - 86400000),
                    amount: 849.5,
                },
                {
                    orderId: "ORD-5645",
                    customer: "Robert Johnson",
                    date: new Date(Date.now() - 172800000),
                    amount: 2199.99,
                },
                {
                    orderId: "ORD-5644",
                    customer: "Emily Wilson",
                    date: new Date(Date.now() - 259200000),
                    amount: 1499.0,
                },
                {
                    orderId: "ORD-5643",
                    customer: "Michael Brown",
                    date: new Date(Date.now() - 345600000),
                    amount: 3299.99,
                },
            ],
            topSellingProducts: [
                {
                    name: "NVIDIA RTX 4080",
                    category: "GPU",
                    sales: 145,
                    revenue: 217500,
                },
                {
                    name: "AMD Ryzen 9 7950X",
                    category: "CPU",
                    sales: 132,
                    revenue: 79200,
                },
                {
                    name: "Samsung 980 PRO 2TB",
                    category: "Storage",
                    sales: 210,
                    revenue: 42000,
                },
                {
                    name: "Corsair Vengeance 32GB",
                    category: "RAM",
                    sales: 178,
                    revenue: 21360,
                },
                {
                    name: "Intel Core i9-14900K",
                    category: "CPU",
                    sales: 105,
                    revenue: 63000,
                },
            ],
        };

        // Try to cache the analytics data, but continue if Redis fails
        try {
            await redis.set(
                "adminAnalytics",
                JSON.stringify(mockAnalyticsData),
                "EX",
                3600
            );
        } catch (redisCacheError) {
            console.log(
                "Redis caching error (continuing without caching):",
                redisCacheError.message
            );
            // Continue without caching
        }

        res.status(200).json(mockAnalyticsData);
    } catch (error) {
        console.error("Error fetching admin analytics:", error);
        res.status(500).json({
            message: "Error fetching analytics data",
            error: error.message,
        });
    }
};
