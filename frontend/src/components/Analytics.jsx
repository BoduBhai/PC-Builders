import { useState } from "react";
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Activity,
  PieChart,
  BarChart3,
} from "lucide-react";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import { formatDate } from "../utils/dateUtils";
import LoadingSpinner from "./LoadingSpinner";

const Analytics = () => {
  const { analytics, loading, error } = useAnalyticsStore();
  const [timeRange, setTimeRange] = useState("week");

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mt-5">
        <span>Failed to load analytics data</span>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const {
    totalRevenue,
    totalUsers,
    totalProducts,
    salesByCategory,
    recentSales,
    topSellingProducts,
    monthlySales,
  } = analytics;

  return (
    <div className="bg-base-200 container mx-auto mt-10 max-w-full rounded-lg p-5 shadow-md">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="mb-4 text-2xl font-bold sm:mb-0">Dashboard Analytics</h2>
        <div className="join">
          <button
            className={`btn join-item ${timeRange === "week" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button
            className={`btn join-item ${timeRange === "month" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button
            className={`btn join-item ${timeRange === "year" ? "btn-active" : ""}`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-base-100 rounded-lg p-5 shadow-xl transition-all hover:translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Revenue</p>
              <h3 className="mt-1 text-3xl font-bold">
                ৳{totalRevenue.toLocaleString()}
              </h3>
              <p className="text-success mt-2 text-xs font-semibold">
                <TrendingUp className="mr-1 inline" size={14} />+
                {analytics.revenueGrowth}% from last {timeRange}
              </p>
            </div>
            <div className="bg-success/20 rounded-full p-3">
              <DollarSign className="text-success" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-lg p-5 shadow-xl transition-all hover:translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <h3 className="mt-1 text-3xl font-bold">
                {totalUsers.toLocaleString()}
              </h3>
              <p className="text-info mt-2 text-xs font-semibold">
                <TrendingUp className="mr-1 inline" size={14} />+
                {analytics.userGrowth}% from last {timeRange}
              </p>
            </div>
            <div className="bg-info/20 rounded-full p-3">
              <Users className="text-info" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-lg p-5 shadow-xl transition-all hover:translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Products</p>
              <h3 className="mt-1 text-3xl font-bold">
                {totalProducts.toLocaleString()}
              </h3>
              <p className="text-warning mt-2 text-xs font-semibold">
                <TrendingUp className="mr-1 inline" size={14} />+
                {analytics.productGrowth}% from last {timeRange}
              </p>
            </div>
            <div className="bg-warning/20 rounded-full p-3">
              <Package className="text-warning" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-lg p-5 shadow-xl transition-all hover:translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Orders</p>
              <h3 className="mt-1 text-3xl font-bold">
                {analytics.totalOrders.toLocaleString()}
              </h3>
              <p className="text-secondary mt-2 text-xs font-semibold">
                <TrendingUp className="mr-1 inline" size={14} />+
                {analytics.orderGrowth}% from last {timeRange}
              </p>
            </div>
            <div className="bg-secondary/20 rounded-full p-3">
              <ShoppingCart className="text-secondary" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Sales Trend */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="card-title flex items-center">
                <BarChart3 className="mr-2" size={20} />
                Sales Trend
              </h3>
              <div className="badge badge-primary">Last {timeRange}</div>
            </div>

            {/* Chart Placeholder - In real app use Chart.js or Recharts */}
            <div className="bg-base-200 flex min-h-52 items-center justify-center rounded-md">
              <div className="flex flex-col items-center space-y-2 p-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm opacity-70">
                  Monthly sales chart would render here
                </p>

                <div className="mt-6 w-full max-w-md">
                  <div className="stat-container flex w-full justify-between">
                    {monthlySales.slice(0, 6).map((month, i) => (
                      <div
                        key={i}
                        className="relative flex w-8 flex-col items-center"
                      >
                        <div
                          className="bg-primary w-6 rounded-t-sm"
                          style={{
                            height: `${(month.value / Math.max(...monthlySales.map((m) => m.value))) * 100}px`,
                          }}
                        ></div>
                        <div className="mt-1 text-xs">{month.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="card-title flex items-center">
                <PieChart className="mr-2" size={20} />
                Sales by Category
              </h3>
              <div className="badge badge-secondary">Top Categories</div>
            </div>

            {/* Simplified Chart */}
            <div className="flex flex-wrap justify-evenly gap-2">
              {salesByCategory.map((category, index) => (
                <div key={index} className="text-center">
                  <div
                    className="radial-progress text-primary"
                    style={{ "--value": category.percentage, "--size": "8rem" }}
                  >
                    {category.percentage}%
                  </div>
                  <p className="mt-2 text-sm font-medium">{category.name}</p>
                  <p className="text-xs opacity-70">
                    ৳{category.value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales & Top Products */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center">
              <Activity className="mr-2" size={20} />
              Recent Sales
            </h3>
            <div className="overflow-x-auto">
              <table className="table-zebra table-xs table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, index) => (
                    <tr key={index}>
                      <td className="text-xs">{sale.orderId}</td>
                      <td className="text-xs">{sale.customer}</td>
                      <td className="text-xs">
                        {formatDate(sale.date, {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="text-xs font-medium">
                        ৳{sale.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Top Selling Products
            </h3>
            <div className="overflow-x-auto">
              <table className="table-zebra table-xs table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="text-xs font-medium">{product.name}</td>
                      <td className="text-xs">{product.category}</td>
                      <td className="text-xs">{product.sales}</td>
                      <td className="text-xs">
                        ৳{product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
