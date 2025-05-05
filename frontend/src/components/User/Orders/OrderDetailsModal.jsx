import { formatDate } from "../../../utils/dateUtils";
import {
  X,
  FileText,
  Clock,
  CreditCard,
  MapPin,
  Package,
  BanknoteIcon,
  Store,
  Calendar,
  CheckCircle,
  Truck,
  ShoppingBag,
} from "lucide-react";

/**
 * Modal component to display detailed information about an order
 */
const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  onCancelOrder,
  cancellingOrderId,
}) => {
  // Helper function to render payment method details
  const renderPaymentMethodDetails = () => {
    if (!order) return null;

    switch (order.paymentMethod) {
      case "card":
        return (
          <>
            <div className="flex items-center gap-2 font-medium">
              <CreditCard size={18} />
              Credit/Debit Card
            </div>
            {order.paymentDetails?.card && (
              <div className="mt-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Card Number:</span>
                  <span className="font-mono">
                    •••• •••• •••• {order.paymentDetails.card.last4 || "****"}
                  </span>

                  <span className="text-gray-600">Card Type:</span>
                  <span>{order.paymentDetails.card.brand || "N/A"}</span>

                  <span className="text-gray-600">Cardholder:</span>
                  <span>{order.paymentDetails.card.holderName || "N/A"}</span>
                </div>
              </div>
            )}
          </>
        );
      case "bank_transfer":
        return (
          <>
            <div className="flex items-center gap-2 font-medium">
              <BanknoteIcon size={18} />
              Bank Transfer
            </div>
            {order.paymentDetails?.bankTransfer && (
              <div className="mt-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Bank Name:</span>
                  <span>
                    {order.paymentDetails.bankTransfer.bankName || "N/A"}
                  </span>

                  <span className="text-gray-600">Account Name:</span>
                  <span>
                    {order.paymentDetails.bankTransfer.accountName || "N/A"}
                  </span>

                  <span className="text-gray-600">Reference Number:</span>
                  <span className="font-mono">
                    {order.paymentDetails.bankTransfer.referenceNumber || "N/A"}
                  </span>
                </div>
              </div>
            )}
          </>
        );
      case "pay_on_pickup":
        return (
          <>
            <div className="flex items-center gap-2 font-medium">
              <Store size={18} />
              Pay on Pickup
            </div>
            <div className="mt-2 text-sm">
              <p>Payment will be collected during pickup at our store.</p>
              <div className="alert alert-info mt-2 text-xs">
                <p>
                  Please bring a valid ID and your order reference number when
                  picking up your order.
                </p>
              </div>
            </div>
          </>
        );
      default:
        return <span>Payment information not available</span>;
    }
  };

  // Helper function to show order status badges
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

  if (!order) return null;

  return (
    <dialog
      id="order_details_modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box max-h-[90vh] max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} />
            <h3 className="text-xl font-bold">Order Details</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Order ID and Date */}
          <div className="mb-6 flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID:</p>
              <p className="font-mono font-bold">
                #{order._id.slice(-8)}
                <span className="block text-xs text-gray-500" title={order._id}>
                  Full ID: {order._id}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date:</p>
              <p className="font-semibold">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Order Status Banner */}
          <div className="mb-6 border-t border-b py-4">
            <h3 className="mb-4 font-semibold">Order Status</h3>
            <div className="flex items-center justify-center">
              <div className="grid w-full grid-cols-4 gap-2">
                <div
                  className={`flex flex-col items-center text-center ${
                    order.orderStatus === "processing" ? "text-primary" : ""
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      order.orderStatus === "processing"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    <ShoppingBag size={16} />
                  </div>
                  <span className="text-xs">Processing</span>
                </div>

                <div
                  className={`flex flex-col items-center text-center ${
                    order.orderStatus === "shipped" ? "text-primary" : ""
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      order.orderStatus === "shipped"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    <Package size={16} />
                  </div>
                  <span className="text-xs">Shipped</span>
                </div>

                <div
                  className={`flex flex-col items-center text-center ${
                    order.orderStatus === "shipped" ? "text-primary" : ""
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      order.orderStatus === "shipped"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    <Truck size={16} />
                  </div>
                  <span className="text-xs">On the way</span>
                </div>

                <div
                  className={`flex flex-col items-center text-center ${
                    order.orderStatus === "delivered" ? "text-primary" : ""
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      order.orderStatus === "delivered"
                        ? "bg-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    <CheckCircle size={16} />
                  </div>
                  <span className="text-xs">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Payment Details */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Order Status</h4>
              <div className="flex items-center gap-2">
                {getOrderStatusBadge(order.orderStatus)}
                {order.orderStatus === "processing" && (
                  <button
                    onClick={() => onCancelOrder(order._id)}
                    className="btn btn-error btn-xs"
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
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Payment Status</h4>
              <div>{getPaymentStatusBadge(order.paymentStatus)}</div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center rounded-lg border p-3"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <img
                      src={item.product?.image}
                      alt={item.product?.modelNo}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium">{item.product?.modelNo}</div>
                    <div className="text-base-content/70 text-sm">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer and Shipping Info */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-1 font-semibold">
                <MapPin size={18} />
                Shipping Address
              </h3>
              <address className="rounded-lg border p-4 not-italic">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </address>
            </div>

            <div>
              <h3 className="mb-2 flex items-center gap-1 font-semibold">
                <CreditCard size={18} />
                Payment Method
              </h3>
              <div className="rounded-lg border p-4">
                {renderPaymentMethodDetails()}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Order Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>৳{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>৳{order.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>৳{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default OrderDetailsModal;
