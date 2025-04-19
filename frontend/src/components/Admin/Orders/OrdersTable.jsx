import React, { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  CreditCard,
  BanknoteIcon,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import LoadingSpinner from "../../LoadingSpinner";

/**
 * Component to display orders table with integrated filtering, search, and sorting
 */
const OrdersTable = ({ orders, loading, onViewOrder, onRefresh }) => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Apply filters whenever orders or filter values change
  useEffect(() => {
    if (!orders) return;

    const filtered = orders.filter((order) => {
      // Search query filter
      const searchMatch =
        searchQuery === "" ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.user?.email &&
          order.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.fname &&
          order.user.fname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.lname &&
          order.user.lname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.fname &&
          order.user?.lname &&
          `${order.user.fname} ${order.user.lname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      // Order status filter
      const statusMatch =
        selectedStatus === "all" || order.orderStatus === selectedStatus;

      // Payment status filter
      const paymentStatusMatch =
        selectedPaymentStatus === "all" ||
        order.paymentStatus === selectedPaymentStatus;

      return searchMatch && statusMatch && paymentStatusMatch;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, selectedStatus, selectedPaymentStatus]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    setSelectedPaymentStatus(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Status badge color mapping
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <span className="badge badge-warning">Processing</span>;
      case "shipped":
        return <span className="badge badge-info">Shipped</span>;
      case "delivered":
        return <span className="badge badge-success">Delivered</span>;
      case "cancelled":
        return <span className="badge badge-error">Cancelled</span>;
      default:
        return <span className="badge badge-ghost">Unknown</span>;
    }
  };

  // Payment status badge color mapping
  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "completed":
        return <span className="badge badge-success">Completed</span>;
      case "failed":
        return <span className="badge badge-error">Failed</span>;
      case "refunded":
        return <span className="badge badge-info">Refunded</span>;
      default:
        return <span className="badge badge-ghost">Unknown</span>;
    }
  };

  // Payment Method Icon
  const getPaymentMethodIcon = (method, size = 20) => {
    switch (method) {
      case "card":
        return <CreditCard size={size} />;
      case "bank_transfer":
        return <BanknoteIcon size={size} />;
      default:
        return null;
    }
  };

  return (
    <div className="card bg-base-100">
      <div className="bg-base-300 pb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>
      <div className="card-body p-0">
        <div className="bg-base-200 border-base-300 flex flex-col items-center justify-between gap-3 border-b p-3 md:flex-row">
          {/* Search bar on the left */}
          <div className="relative flex w-full items-center md:w-auto">
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              className="input input-bordered input-sm w-full pr-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400"
              size={16}
            />
          </div>

          {/* Filter and refresh buttons on the right */}
          <div className="flex w-full justify-end gap-3 md:w-auto">
            <button
              className="btn btn-sm btn-outline gap-2"
              onClick={toggleFilters}
            >
              <Filter size={16} />
              {isFilterOpen ? "Hide Filters" : "Filters"}
            </button>

            <button
              className="btn btn-sm btn-primary gap-2"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-base-100 border-base-300 flex flex-col gap-3 border-b p-3 md:flex-row">
            <div className="form-control w-full md:w-1/3">
              <label className="label">
                <span className="label-text font-medium">Order Status</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-control w-full md:w-1/3">
              <label className="label">
                <span className="label-text font-medium">Payment Status</span>
              </label>
              <select
                className="select select-bordered select-sm w-full"
                value={selectedPaymentStatus}
                onChange={handlePaymentStatusChange}
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="mb-2 flex w-full items-end md:w-1/3">
              <button
                className="btn btn-sm w-full"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[65vh] flex-col">
          <div className="flex-grow overflow-x-auto overflow-y-auto">
            <table className="table-zebra table-pin-rows table-pin-cols table w-full min-w-[900px]">
              <thead>
                <tr>
                  <th className="min-w-[110px]">Order ID</th>
                  <th className="min-w-[200px]">Customer</th>
                  <th className="min-w-[130px]">Date</th>
                  <th className="min-w-[100px]">Total</th>
                  <th className="min-w-[120px]">Order Status</th>
                  <th className="min-w-[150px]">Payment</th>
                  <th className="min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover">
                      <td className="font-mono">
                        <div className="flex flex-col">
                          <span>#{order._id.slice(-8)}</span>
                          <span
                            className="text-xs text-gray-500 hover:overflow-visible hover:whitespace-normal"
                            title={order._id}
                          >
                            {order._id}
                          </span>
                        </div>
                      </td>
                      <td>
                        {order.user ? (
                          <div>
                            <div className="font-semibold">
                              {order.user.fname} {order.user.lname}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user.email}
                            </div>
                          </div>
                        ) : (
                          "Unknown User"
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="opacity-70" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="font-semibold">
                        ৳{order.total.toFixed(2)}
                      </td>
                      <td>{getOrderStatusBadge(order.orderStatus)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(order.paymentMethod, 16)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-circle btn-ghost"
                          onClick={() => onViewOrder(order)}
                          title="View Details"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      {loading ? (
                        <LoadingSpinner size="md" />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Package size={40} className="mb-2 text-gray-400" />
                          <p>No orders found</p>
                          {searchQuery ||
                          selectedStatus !== "all" ||
                          selectedPaymentStatus !== "all" ? (
                            <button
                              className="btn btn-ghost btn-sm mt-2"
                              onClick={handleClearFilters}
                            >
                              Clear Filters
                            </button>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
