import { useState, useEffect } from "react";
import { useAdminOrderStore } from "../../stores/useAdminOrderStore";
import {
  Calendar,
  Search,
  Package,
  Truck,
  CircleCheck,
  CircleOff,
  AlertCircle,
  CreditCard,
  BanknoteIcon,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const AdminOrdersPage = () => {
  const { allOrders, fetchAllOrders, updateOrderStatus, loading } =
    useAdminOrderStore();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Apply filters when orders, search query, or filter selections change
  useEffect(() => {
    if (!allOrders) return;

    let results = [...allOrders];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (order) =>
          order._id.toLowerCase().includes(query) ||
          order.user?.email?.toLowerCase().includes(query) ||
          order.user?.fname?.toLowerCase().includes(query) ||
          order.user?.lname?.toLowerCase().includes(query) ||
          `${order.user?.fname} ${order.user?.lname}`
            .toLowerCase()
            .includes(query),
      );
    }

    // Apply order status filter
    if (selectedStatus !== "all") {
      results = results.filter((order) => order.orderStatus === selectedStatus);
    }

    // Apply payment status filter
    if (selectedPaymentStatus !== "all") {
      results = results.filter(
        (order) => order.paymentStatus === selectedPaymentStatus,
      );
    }

    setFilteredOrders(results);
  }, [allOrders, searchQuery, selectedStatus, selectedPaymentStatus]);

  // Handle opening order details modal
  const handleViewOrderDetails = (order) => {
    setCurrentOrder(order);
    document.getElementById("order_details_modal").showModal();
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { orderStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Handle updating payment status
  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { paymentStatus });
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setProcessingOrderId(null);
    }
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

  // Order Status Icon
  const getOrderStatusIcon = (status, size = 20) => {
    switch (status) {
      case "processing":
        return <Package size={size} className="text-warning" />;
      case "shipped":
        return <Truck size={size} className="text-info" />;
      case "delivered":
        return <CircleCheck size={size} className="text-success" />;
      case "cancelled":
        return <CircleOff size={size} className="text-error" />;
      default:
        return <AlertCircle size={size} className="text-ghost" />;
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

  // Payment Status Icon
  const getPaymentStatusIcon = (status, size = 20) => {
    switch (status) {
      case "pending":
        return <Clock size={size} className="text-warning" />;
      case "completed":
        return <CheckCircle2 size={size} className="text-success" />;
      case "failed":
        return <XCircle size={size} className="text-error" />;
      case "refunded":
        return <RefreshCw size={size} className="text-info" />;
      default:
        return <AlertCircle size={size} className="text-ghost" />;
    }
  };

  if (loading && !allOrders.length) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
          <div className="relative max-w-md flex-1">
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              className="input input-bordered w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute top-3 right-3 text-gray-400"
              size={20}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="select select-bordered"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="select select-bordered"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => fetchAllOrders()}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xl text-success" />
          ) : (
            "Refresh Orders"
          )}
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-base-100 overflow-x-auto rounded-lg border shadow-md">
        <table className="table-zebra table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="max-w-[100px] overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap md:text-sm">
                    <div className="flex flex-col">
                      <span>#{order._id.slice(-8)}</span>
                      <span
                        className="text-xs text-gray-500 hover:overflow-visible hover:text-clip"
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
                  <td className="font-semibold">৳{order.total.toFixed(2)}</td>
                  <td>{getOrderStatusBadge(order.orderStatus)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(order.paymentMethod, 16)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-ghost btn-circle"
                        onClick={() => handleViewOrderDetails(order)}
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

      {/* Order Details Modal */}
      <dialog id="order_details_modal" className="modal">
        <div className="modal-box max-w-4xl">
          {currentOrder && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Order Details</h3>
                <form method="dialog">
                  <button className="btn btn-ghost btn-sm">Close</button>
                </form>
              </div>

              <div className="divider my-2"></div>

              {/* Order ID and Date */}
              <div className="mb-4 flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID:</p>
                  <p className="font-mono font-bold">
                    #{currentOrder._id.slice(-8)}
                    <span
                      className="block text-xs text-gray-500"
                      title={currentOrder._id}
                    >
                      Full ID: {currentOrder._id}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date:</p>
                  <p className="font-semibold">
                    {formatDate(currentOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Customer Information</h4>
                <div className="bg-base-200 rounded p-3">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {currentOrder.user.fname} {currentOrder.user.lname}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {currentOrder.user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {currentOrder.user.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Shipping Address</h4>
                <div className="bg-base-200 rounded p-3">
                  <p>{currentOrder.shippingAddress.street}</p>
                  <p>
                    {currentOrder.shippingAddress.city},{" "}
                    {currentOrder.shippingAddress.state}{" "}
                    {currentOrder.shippingAddress.zipCode}
                  </p>
                  <p>{currentOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="table-sm table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="flex items-center gap-2">
                            <div className="bg-base-200 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md">
                              <img
                                src={item.product.image}
                                alt={item.product.modelNo}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-semibold">
                                {item.product.modelNo}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.product.category}
                              </div>
                            </div>
                          </td>
                          <td>৳{item.price.toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td>৳{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">Order Summary</h4>
                <div className="bg-base-200 rounded p-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>৳{currentOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>৳{currentOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>৳{currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Order Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`btn btn-sm ${currentOrder.orderStatus === "processing" ? "btn-warning" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdateOrderStatus(currentOrder._id, "processing")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getOrderStatusIcon("processing", 16)}
                          Processing
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.orderStatus === "shipped" ? "btn-info" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdateOrderStatus(currentOrder._id, "shipped")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getOrderStatusIcon("shipped", 16)}
                          Shipped
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.orderStatus === "delivered" ? "btn-success" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdateOrderStatus(currentOrder._id, "delivered")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getOrderStatusIcon("delivered", 16)}
                          Delivered
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.orderStatus === "cancelled" ? "btn-error" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdateOrderStatus(currentOrder._id, "cancelled")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getOrderStatusIcon("cancelled", 16)}
                          Cancelled
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Payment Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`btn btn-sm ${currentOrder.paymentStatus === "pending" ? "btn-warning" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdatePaymentStatus(currentOrder._id, "pending")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getPaymentStatusIcon("pending", 16)}
                          Pending
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.paymentStatus === "completed" ? "btn-success" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdatePaymentStatus(currentOrder._id, "completed")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getPaymentStatusIcon("completed", 16)}
                          Completed
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.paymentStatus === "failed" ? "btn-error" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdatePaymentStatus(currentOrder._id, "failed")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getPaymentStatusIcon("failed", 16)}
                          Failed
                        </>
                      )}
                    </button>
                    <button
                      className={`btn btn-sm ${currentOrder.paymentStatus === "refunded" ? "btn-info" : "btn-outline"}`}
                      onClick={() =>
                        handleUpdatePaymentStatus(currentOrder._id, "refunded")
                      }
                      disabled={processingOrderId === currentOrder._id}
                    >
                      {processingOrderId === currentOrder._id ? (
                        <span className="loading loading-spinner loading-xs text-success" />
                      ) : (
                        <>
                          {getPaymentStatusIcon("refunded", 16)}
                          Refunded
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AdminOrdersPage;
