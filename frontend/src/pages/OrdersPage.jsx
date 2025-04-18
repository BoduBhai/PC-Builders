import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../stores/useOrderStore";
import { formatDate } from "../utils/dateUtils";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    processing: {
      color: "badge-warning",
      icon: <Clock size={14} className="mr-1" />,
      text: "Processing",
    },
    shipped: {
      color: "badge-info",
      icon: <Package size={14} className="mr-1" />,
      text: "Shipped",
    },
    delivered: {
      color: "badge-success",
      icon: <CheckCircle size={14} className="mr-1" />,
      text: "Delivered",
    },
    cancelled: {
      color: "badge-error",
      icon: <XCircle size={14} className="mr-1" />,
      text: "Cancelled",
    },
  };

  const config = statusConfig[status] || statusConfig.processing;

  return (
    <span className={`badge ${config.color} gap-1`}>
      {config.icon}
      {config.text}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "badge-warning",
      text: "Payment Pending",
    },
    completed: {
      color: "badge-success",
      text: "Paid",
    },
    failed: {
      color: "badge-error",
      text: "Payment Failed",
    },
    refunded: {
      color: "badge-info",
      text: "Refunded",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return <span className={`badge ${config.color}`}>{config.text}</span>;
};

const OrdersPage = () => {
  const { orders, loading, fetchUserOrders, cancelOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.orderStatus === activeTab;
  });

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancellingOrderId(orderId);
      try {
        await cancelOrder(orderId);
      } catch (error) {
        console.error("Error cancelling order:", error);
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto my-10 flex min-h-[60vh] items-center justify-center pt-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 p-4 pt-16">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-base-100 flex min-h-[40vh] flex-col items-center justify-center rounded-lg p-8 text-center shadow">
          <FileText size={64} className="mb-4 text-gray-300" />
          <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
          <p className="mb-6 text-gray-500">
            You haven't placed any orders yet. Start shopping to see your orders
            here!
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Tabs for filtering */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`btn btn-sm ${activeTab === "all" ? "btn-primary" : "btn-ghost"}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setActiveTab("processing")}
              className={`btn btn-sm ${activeTab === "processing" ? "btn-primary" : "btn-ghost"}`}
            >
              Processing
            </button>
            <button
              onClick={() => setActiveTab("shipped")}
              className={`btn btn-sm ${activeTab === "shipped" ? "btn-primary" : "btn-ghost"}`}
            >
              Shipped
            </button>
            <button
              onClick={() => setActiveTab("delivered")}
              className={`btn btn-sm ${activeTab === "delivered" ? "btn-primary" : "btn-ghost"}`}
            >
              Delivered
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`btn btn-sm ${activeTab === "cancelled" ? "btn-primary" : "btn-ghost"}`}
            >
              Cancelled
            </button>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-base-100 grid gap-4 rounded-lg p-4 shadow-md md:grid-cols-4"
              >
                <div className="md:col-span-3">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2">
                    <div>
                      <span className="text-base-content/60 text-sm font-medium">
                        ORDER #
                      </span>
                      <Link
                        to={`/order-confirmation/${order._id}`}
                        className="hover:text-primary ml-1 font-semibold hover:underline"
                      >
                        {order._id.substring(order._id.length - 8)}
                      </Link>
                    </div>
                    <div className="space-x-2">
                      <OrderStatusBadge status={order.orderStatus} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                  </div>

                  <div className="text-base-content/70 mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="mr-1">Date:</span>
                      <span className="font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="mr-1">Total:</span>
                      <span className="font-medium">
                        ৳{order.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="mr-1">Items:</span>
                      <span className="font-medium">
                        {order.items.length} item(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="relative h-16 w-16 overflow-hidden rounded-md border"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.modelNo}
                          className="h-full w-full object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="bg-base-200/80 absolute right-0 bottom-0 rounded-tl px-1 text-xs">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="bg-base-200 flex h-16 w-16 items-center justify-center rounded-md border text-center text-sm">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2 md:items-end">
                  <Link
                    to={`/order-confirmation/${order._id}`}
                    className="btn btn-outline btn-sm w-full md:w-auto"
                  >
                    View Details
                  </Link>
                  {order.orderStatus === "processing" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className={`btn btn-error btn-sm w-full md:w-auto ${
                        cancellingOrderId === order._id ? "loading" : ""
                      }`}
                      disabled={cancellingOrderId === order._id}
                    >
                      {cancellingOrderId === order._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
