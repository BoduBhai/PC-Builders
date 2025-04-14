import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { redis } from "../lib/redis.js";

/**
 * Get admin dashboard analytics data
 * This controller fetches real data from the database
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
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({
            orderStatus: { $ne: "cancelled" },
            paymentStatus: { $in: ["completed", "pending"] },
        });

        let totalRevenue = 0;
        orders.forEach((order) => {
            totalRevenue += order.total;
        });

        // Calculate growth metrics (comparing to previous month)
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        // User growth
        const newUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        const previousNewUsers = await User.countDocuments({
            createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
        });
        const userGrowth =
            previousNewUsers > 0
                ? (
                      ((newUsers - previousNewUsers) / previousNewUsers) *
                      100
                  ).toFixed(1)
                : 0;

        // Order growth
        const newOrders = await Order.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        const previousNewOrders = await Order.countDocuments({
            createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
        });
        const orderGrowth =
            previousNewOrders > 0
                ? (
                      ((newOrders - previousNewOrders) / previousNewOrders) *
                      100
                  ).toFixed(1)
                : 0;

        // Revenue growth
        const currentMonthRevenue = orders
            .filter((order) => order.createdAt >= oneMonthAgo)
            .reduce((sum, order) => sum + order.total, 0);

        const previousMonthOrders = await Order.find({
            createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
            orderStatus: { $ne: "cancelled" },
            paymentStatus: { $in: ["completed", "pending"] },
        });

        const previousMonthRevenue = previousMonthOrders.reduce(
            (sum, order) => sum + order.total,
            0
        );

        const revenueGrowth =
            previousMonthRevenue > 0
                ? (
                      ((currentMonthRevenue - previousMonthRevenue) /
                          previousMonthRevenue) *
                      100
                  ).toFixed(1)
                : 0;

        // Product growth
        const newProducts = await Product.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        const previousNewProducts = await Product.countDocuments({
            createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
        });
        const productGrowth =
            previousNewProducts > 0
                ? (
                      ((newProducts - previousNewProducts) /
                          previousNewProducts) *
                      100
                  ).toFixed(1)
                : 0;

        // Get sales by category
        const orderItems = orders.flatMap((order) => order.items);
        const productIds = orderItems.map((item) => item.product);

        const products = await Product.find({
            _id: { $in: productIds },
        });

        // Create a map to quickly look up products
        const productMap = products.reduce((map, product) => {
            map[product._id.toString()] = product;
            return map;
        }, {});

        // Calculate sales by category
        const categoryMap = {};

        orderItems.forEach((item) => {
            const product = productMap[item.product.toString()];
            if (product) {
                const category = product.category;
                if (!categoryMap[category]) {
                    categoryMap[category] = {
                        name: category,
                        value: 0,
                        totalSales: 0,
                    };
                }
                categoryMap[category].value += item.price * item.quantity;
                categoryMap[category].totalSales += item.quantity;
            }
        });

        const salesByCategory = Object.values(categoryMap);

        // Calculate percentages for each category
        const totalCategoryRevenue = salesByCategory.reduce(
            (sum, category) => sum + category.value,
            0
        );

        salesByCategory.forEach((category) => {
            category.percentage = Math.round(
                (category.value / totalCategoryRevenue) * 100
            );
        });

        // Sort by value (descending)
        salesByCategory.sort((a, b) => b.value - a.value);

        // Get monthly sales data for the chart
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const currentYear = now.getFullYear();
        const monthlySales = [];

        for (let i = 0; i < 12; i++) {
            const startDate = new Date(currentYear, i, 1);
            const endDate = new Date(currentYear, i + 1, 0);

            const monthlyOrders = await Order.find({
                createdAt: { $gte: startDate, $lte: endDate },
                orderStatus: { $ne: "cancelled" },
                paymentStatus: { $in: ["completed", "pending"] },
            });

            const monthlyRevenue = monthlyOrders.reduce(
                (sum, order) => sum + order.total,
                0
            );

            monthlySales.push({
                label: months[i],
                value: Math.round(monthlyRevenue),
            });
        }

        // Get recent sales data
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "user",
                select: "fname lname",
            });

        const recentSales = recentOrders.map((order) => ({
            orderId: `ORD-${order._id.toString().slice(-5)}`,
            customer: order.user
                ? `${order.user.fname} ${order.user.lname}`
                : "Guest User",
            date: order.createdAt,
            amount: order.total,
        }));

        // Get top selling products
        const topSellingProducts = [];

        // Create a map to track quantity sold for each product
        const productSalesMap = {};

        orderItems.forEach((item) => {
            const productId = item.product.toString();
            if (!productSalesMap[productId]) {
                productSalesMap[productId] = {
                    productId,
                    sales: 0,
                    revenue: 0,
                };
            }
            productSalesMap[productId].sales += item.quantity;
            productSalesMap[productId].revenue += item.price * item.quantity;
        });

        // Convert to array and sort by sales
        const topProducts = Object.values(productSalesMap)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        // Get product details for top selling products
        for (const product of topProducts) {
            const productData = await Product.findById(product.productId);
            if (productData) {
                topSellingProducts.push({
                    name: productData.modelNo,
                    category: productData.category,
                    sales: product.sales,
                    revenue: product.revenue,
                });
            }
        }

        const analyticsData = {
            totalRevenue,
            totalUsers,
            totalProducts,
            totalOrders,
            revenueGrowth,
            userGrowth,
            productGrowth,
            orderGrowth,
            salesByCategory,
            monthlySales,
            recentSales,
            topSellingProducts,
        };

        // Try to cache the analytics data, but continue if Redis fails
        try {
            await redis.set(
                "adminAnalytics",
                JSON.stringify(analyticsData),
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

        res.status(200).json(analyticsData);
    } catch (error) {
        console.error("Error fetching admin analytics:", error);
        res.status(500).json({
            message: "Error fetching analytics data",
            error: error.message,
        });
    }
};
