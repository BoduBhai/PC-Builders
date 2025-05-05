import { formatDate } from "../../../utils/dateUtils";
import {
  Package,
  Search,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner";

/**
 * Component to display user's orders in a table with filtering capabilities
 */
const UserOrdersTable = ({
  orders,
  filteredOrders,
  loading,
  searchQuery,
  activeTab,
  onSearchChange,
  onCancelOrder,
  onViewOrderDetails,
  cancellingOrderId,
  onClearFilters,
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

  if (orders.length === 0) {
    return (
      <div className="bg-base-200 flex min-h-[40vh] flex-col items-center justify-center rounded-lg p-8 text-center">
        <Package size={64} className="mb-4 text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
        <p className="mb-6 text-gray-500">
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </p>
        <a href="/products" className="btn btn-primary">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-[65vh] flex-col">
      <div className="bg-base-200 border-base-300 flex flex-col items-center justify-between gap-3 border-b p-3 md:flex-row">
        {/* Search bar on the left */}
        <div className="relative flex w-full items-center md:w-auto">
          <input
            type="text"
            placeholder="Search order by ID..."
            className="input input-bordered input-sm w-full pr-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search
            className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-400"
            size={16}
          />
        </div>
      </div>

      <div className="flex-grow overflow-x-auto overflow-y-auto">
        <table className="table-zebra table-pin-rows table-pin-cols table w-full min-w-[900px]">
          <thead>
            <tr>
              <th className="min-w-[110px]">Order ID</th>
              <th className="min-w-[130px]">Date</th>
              <th className="min-w-[100px]">Total</th>
              <th className="min-w-[100px]">Items</th>
              <th className="min-w-[120px]">Order Status</th>
              <th className="min-w-[150px]">Payment</th>
              <th className="min-w-[100px]">Actions</th>
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
                    <div className="flex items-center gap-1">
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </td>
                  <td className="font-semibold">৳{order.total.toFixed(2)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span>{order.items.length} item(s)</span>
                    </div>
                  </td>
                  <td>{getOrderStatusBadge(order.orderStatus)}</td>
                  <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewOrderDetails(order)}
                        className="btn btn-sm btn-circle btn-ghost"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {order.orderStatus === "processing" && (
                        <button
                          onClick={() => onCancelOrder(order._id)}
                          className="btn btn-sm btn-circle btn-error btn-ghost"
                          disabled={cancellingOrderId === order._id}
                          title="Cancel Order"
                        >
                          {cancellingOrderId === order._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <XCircle size={16} />
                          )}
                        </button>
                      )}
                    </div>
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
                      <p>No orders found matching your filters</p>
                      {searchQuery || activeTab !== "all" ? (
                        <button
                          className="btn btn-ghost btn-sm mt-2"
                          onClick={onClearFilters}
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
  );
};

export default UserOrdersTable;
