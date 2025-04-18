// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\OrdersTable.jsx
import React from "react";
import { Calendar, Package, CreditCard, BanknoteIcon } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import LoadingSpinner from "../../LoadingSpinner";

/**
 * Component to display orders table with sorting, filtering and pagination
 */
const OrdersTable = ({
  orders,
  loading,
  onViewOrder,
  searchQuery,
  selectedStatus,
  selectedPaymentStatus,
  setSearchQuery,
  setSelectedStatus,
  setSelectedPaymentStatus,
}) => {
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
    <div className="card bg-base-100 border-base-300 border shadow-xl">
      <div className="card-body p-0">
        <div className="bg-base-200 border-base-300 border-b p-3 text-lg font-semibold">
          Orders List
        </div>
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "65vh",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
          }}
        >
          <div className="overflow-x-auto">
            <table className="table-zebra table-pin-rows table-pin-cols table w-full">
              <thead className="bg-base-200">
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
                {orders.length > 0 ? (
                  orders.map((order) => (
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
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedStatus("all");
                                setSelectedPaymentStatus("all");
                              }}
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
