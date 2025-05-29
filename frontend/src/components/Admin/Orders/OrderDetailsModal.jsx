// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\OrderDetailsModal.jsx
import React, { useState, useEffect } from "react";
import { FileText, X, Shield, Clock } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import OrderStatusButtons from "./OrderStatusButtons";
import PaymentStatusButtons from "./PaymentStatusButtons";
import OrderItemsList from "./OrderItemsList";
import usePaymentService from "../../../stores/usePaymentService";

// Print icon component
const PrintIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect width="12" height="8" x="6" y="14"></rect>
  </svg>
);

const OrderDetailsModal = ({
  order,
  closeModal,
  processingOrderId,
  expandedItems,
  toggleItemExpansion,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
}) => {
  const { getOrderPaymentDetails, loading: paymentDetailsLoading } =
    usePaymentService();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(null);
  const [timelineKey, setTimelineKey] = useState(Date.now());

  const displayOrder = updatedOrder || order;

  useEffect(() => {
    if (order) {
      setUpdatedOrder(order);
      setTimelineKey(Date.now());
    }
  }, [order]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      setPaymentDetails(null);
      await handleUpdateOrderStatus(orderId, status);
      const details = await getOrderPaymentDetails(orderId);
      setPaymentDetails(details);
      setTimelineKey(Date.now());
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, status) => {
    try {
      setPaymentDetails(null);
      await handleUpdatePaymentStatus(orderId, status);
      const details = await getOrderPaymentDetails(orderId);
      setPaymentDetails(details);
      setTimelineKey(Date.now());
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  // Fetch enhanced payment details when order is selected
  useEffect(() => {
    if (displayOrder?._id) {
      const fetchPaymentDetails = async () => {
        try {
          const details = await getOrderPaymentDetails(displayOrder._id);
          setPaymentDetails(details);
        } catch (error) {
          console.error("Failed to fetch payment details:", error);
        }
      };

      fetchPaymentDetails();
    }
  }, [displayOrder?._id, getOrderPaymentDetails, timelineKey]);

  if (!displayOrder) return null;

  return (
    <dialog id="order_details_modal" className="modal">
      <div className="modal-box max-h-[90vh] max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} />
            <h3 className="text-xl font-bold">Order Details</h3>
          </div>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Order ID and Date */}
          <div className="mb-6 flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID:</p>
              <p className="font-mono font-bold">
                #{displayOrder._id.slice(-8)}
                <span
                  className="block text-xs text-gray-500"
                  title={displayOrder._id}
                >
                  Full ID: {displayOrder._id}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date:</p>
              <p className="font-semibold">
                {formatDate(displayOrder.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer and Shipping Info in a responsive grid */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <div>
              <h4 className="mb-2 flex items-center gap-1 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Customer Information
              </h4>
              <div className="bg-base-200 rounded-lg p-4 shadow-sm">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {displayOrder.user.fname} {displayOrder.user.lname}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {displayOrder.user.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {displayOrder.user.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="mb-2 flex items-center gap-1 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 13-3-3 3-3 3 3-3 3Z"></path>
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
                Shipping Address
              </h4>
              <div className="bg-base-200 rounded-lg p-4 shadow-sm">
                <p>{displayOrder.shippingAddress.street}</p>
                <p>
                  {displayOrder.shippingAddress.city},{" "}
                  {displayOrder.shippingAddress.state}{" "}
                  {displayOrder.shippingAddress.zipCode}
                </p>
                <p>{displayOrder.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Status Management with improved buttons */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 flex items-center gap-1 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 16H8a6 6 0 0 1 0-12h8"></path>
                  <path d="M12 16v4"></path>
                  <path d="M8 16v4"></path>
                  <path d="M16 16v4"></path>
                  <path d="m22 10-3-3 3-3"></path>
                </svg>
                Order Status
              </h4>
              <div className="bg-base-200 rounded-lg p-4 shadow-sm">
                <OrderStatusButtons
                  currentStatus={displayOrder.orderStatus}
                  isProcessing={processingOrderId === displayOrder._id}
                  onStatusChange={(status) =>
                    handleOrderStatusUpdate(displayOrder._id, status)
                  }
                />
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-1 font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                Payment Status
              </h4>
              <div className="bg-base-200 rounded-lg p-4 shadow-sm">
                <PaymentStatusButtons
                  currentStatus={displayOrder.paymentStatus}
                  isProcessing={processingOrderId === displayOrder._id}
                  onStatusChange={(status) =>
                    handlePaymentStatusUpdate(displayOrder._id, status)
                  }
                />
              </div>
            </div>
          </div>

          {/* Enhanced Payment Details */}
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-1 font-semibold">
              <Shield size={18} />
              Payment Details
            </h4>
            <div className="bg-base-200 rounded-lg p-4 shadow-sm">
              {paymentDetailsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : !paymentDetails ? (
                <p className="text-center text-sm text-gray-500">
                  Payment details unavailable
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {displayOrder.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : "Bank Transfer"}
                    </span>

                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">
                      {paymentDetails.paymentDetails?.transactionId || "N/A"}
                    </span>

                    <span className="text-gray-600">Payment Time:</span>
                    <span>
                      {paymentDetails.paymentDetails?.paymentTime
                        ? formatDate(paymentDetails.paymentDetails.paymentTime)
                        : "N/A"}
                    </span>
                  </div>

                  {/* Method-specific details */}
                  {displayOrder.paymentMethod === "card" &&
                    paymentDetails.paymentDetails?.card && (
                      <div className="border-t pt-3">
                        <h5 className="mb-2 font-medium">Card Details</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Card Brand:</span>
                          <span>
                            {paymentDetails.paymentDetails.card.brand ||
                              "Unknown"}
                          </span>

                          <span className="text-gray-600">Last 4 digits:</span>
                          <span className="font-mono">
                            {paymentDetails.paymentDetails.card.last4 || "xxxx"}
                          </span>

                          <span className="text-gray-600">Cardholder:</span>
                          <span>
                            {paymentDetails.paymentDetails.card.holderName ||
                              "N/A"}
                          </span>

                          <span className="text-gray-600">Expiry:</span>
                          <span>
                            {paymentDetails.paymentDetails.card.expiryMonth &&
                            paymentDetails.paymentDetails.card.expiryYear
                              ? `${paymentDetails.paymentDetails.card.expiryMonth}/${paymentDetails.paymentDetails.card.expiryYear.substr(
                                  2,
                                )}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}

                  {displayOrder.paymentMethod === "bank_transfer" &&
                    paymentDetails.paymentDetails?.bankTransfer && (
                      <div className="border-t pt-3">
                        <h5 className="mb-2 font-medium">Bank Details</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Bank Name:</span>
                          <span>
                            {paymentDetails.paymentDetails.bankTransfer
                              .bankName || "N/A"}
                          </span>

                          <span className="text-gray-600">Account Name:</span>
                          <span>
                            {paymentDetails.paymentDetails.bankTransfer
                              .accountName || "N/A"}
                          </span>

                          <span className="text-gray-600">
                            Reference Number:
                          </span>
                          <span className="font-mono">
                            {paymentDetails.paymentDetails.bankTransfer
                              .referenceNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Payment Timeline - Enhanced to show all timeline events */}
                  <div className="mt-3 border-t pt-3">
                    <h5 className="mb-3 flex items-center gap-1 font-medium">
                      <Clock size={16} />
                      Order Timeline
                    </h5>
                    <div className="relative ml-2">
                      {/* Check if paymentDetails has timeline and render each event */}
                      {paymentDetails &&
                      paymentDetails.timeline &&
                      paymentDetails.timeline.length > 0 ? (
                        paymentDetails.timeline.map((event, index) => (
                          <div
                            key={index}
                            className="mb-6 flex items-start gap-3"
                          >
                            <div className="relative">
                              {/* Use different colors based on event status type */}
                              <div
                                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                                  event.status === "created"
                                    ? "bg-primary"
                                    : event.status === "cancelled"
                                      ? "bg-error"
                                      : event.status?.startsWith(
                                            "payment_completed",
                                          )
                                        ? "bg-success"
                                        : event.status?.startsWith("payment_")
                                          ? "bg-warning"
                                          : event.status?.startsWith(
                                                "order_delivered",
                                              )
                                            ? "bg-success"
                                            : event.status?.startsWith(
                                                  "order_shipped",
                                                )
                                              ? "bg-info"
                                              : "bg-secondary"
                                }`}
                              >
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                              </div>
                              {/* Add connecting line if not the last item */}
                              {index < paymentDetails.timeline.length - 1 && (
                                <div className="absolute top-7 bottom-0 left-1/2 h-10 w-0.5 -translate-x-1/2 bg-gray-200"></div>
                              )}
                            </div>
                            <div>
                              {/* Format the status for display */}
                              <div className="font-medium">
                                {event.status === "created"
                                  ? "Order Created"
                                  : event.status === "cancelled"
                                    ? "Order Cancelled"
                                    : event.status?.startsWith("payment_")
                                      ? `Payment ${event.status
                                          .replace("payment_", "")
                                          .charAt(0)
                                          .toUpperCase()}${event.status
                                          .replace("payment_", "")
                                          .slice(1)}`
                                      : event.status?.startsWith("order_")
                                        ? `Order ${event.status
                                            .replace("order_", "")
                                            .charAt(0)
                                            .toUpperCase()}${event.status
                                            .replace("order_", "")
                                            .slice(1)}`
                                        : event.status.charAt(0).toUpperCase() +
                                          event.status.slice(1)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(event.timestamp)}
                              </div>
                              {event.note && (
                                <div className="mt-1 text-sm text-gray-600">
                                  {event.note}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback to show at least the creation event if no detailed timeline
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="bg-primary mt-0.5 flex h-6 w-6 items-center justify-center rounded-full">
                              <span className="h-2 w-2 rounded-full bg-white"></span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Order Created</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(displayOrder.createdAt)}
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Order placed successfully
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-1 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                <path d="M2 7h20"></path>
                <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path>
                <path d="M2 7v3a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2V7"></path>
              </svg>
              Order Items ({displayOrder.items.length})
            </h4>
            <OrderItemsList
              items={displayOrder.items}
              expandedItems={expandedItems}
              toggleItemExpansion={toggleItemExpansion}
            />
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h4 className="mb-2 flex items-center gap-1 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                <path d="M12 17.5v-11"></path>
              </svg>
              Order Summary
            </h4>
            <div className="bg-base-200 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-right">
                  ৳{displayOrder.subtotal.toFixed(2)}
                </span>
                <span className="text-gray-600">Tax</span>
                <span className="text-right">
                  ৳{displayOrder.tax.toFixed(2)}
                </span>
                <span className="text-gray-600">Shipping</span>
                <span className="text-right">
                  ৳{displayOrder.shipping.toFixed(2)}
                </span>
                <span className="mt-1 border-t pt-2 text-base font-semibold">
                  Total
                </span>
                <span className="mt-1 border-t pt-2 text-right text-base font-semibold">
                  ৳{displayOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-outline" onClick={closeModal}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              // Implement any action you want here (e.g., print order, export, etc.)
              window.print();
            }}
          >
            <PrintIcon size={18} />
            Print Order
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default OrderDetailsModal;
