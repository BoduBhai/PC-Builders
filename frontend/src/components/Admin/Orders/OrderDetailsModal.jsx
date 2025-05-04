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

/**
 * Modal component for displaying order details
 */
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
  const [showFullPaymentDetails, setShowFullPaymentDetails] = useState(false);

  // Fetch enhanced payment details when order is selected
  useEffect(() => {
    if (order?._id) {
      const fetchPaymentDetails = async () => {
        try {
          const details = await getOrderPaymentDetails(order._id);
          setPaymentDetails(details);
        } catch (error) {
          console.error("Failed to fetch payment details:", error);
        }
      };

      fetchPaymentDetails();
    }
  }, [order?._id, getOrderPaymentDetails]);

  if (!order) return null;

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
                  {order.user.fname} {order.user.lname}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {order.user.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {order.user.phone || "N/A"}
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
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
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
                  currentStatus={order.orderStatus}
                  isProcessing={processingOrderId === order._id}
                  onStatusChange={(status) =>
                    handleUpdateOrderStatus(order._id, status)
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
                  currentStatus={order.paymentStatus}
                  isProcessing={processingOrderId === order._id}
                  onStatusChange={(status) =>
                    handleUpdatePaymentStatus(order._id, status)
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
                      {order.paymentMethod === "card"
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
                  {order.paymentMethod === "card" &&
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
                              ? `${paymentDetails.paymentDetails.card.expiryMonth}/${paymentDetails.paymentDetails.card.expiryYear.substr(2)}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}

                  {order.paymentMethod === "bank_transfer" &&
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

                  {/* Security Information - Collapsed by default */}
                  <button
                    className="btn btn-sm btn-outline w-full"
                    onClick={() =>
                      setShowFullPaymentDetails(!showFullPaymentDetails)
                    }
                  >
                    {showFullPaymentDetails ? "Hide" : "Show"} Security
                    Information
                  </button>

                  {showFullPaymentDetails && paymentDetails.clientInfo && (
                    <div className="border-t pt-3 text-sm">
                      <h5 className="mb-2 font-medium">Security Information</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">IP Address:</span>
                        <span className="font-mono">
                          {paymentDetails.clientInfo.ipAddress || "Unknown"}
                        </span>

                        <span className="text-gray-600">User Agent:</span>
                        <span className="truncate">
                          {paymentDetails.clientInfo.userAgent || "Unknown"}
                        </span>

                        <span className="text-gray-600">Session ID:</span>
                        <span className="font-mono text-xs">
                          {paymentDetails.clientInfo.sessionId || "Unknown"}
                        </span>

                        <span className="text-gray-600">
                          Security Fingerprint:
                        </span>
                        <span className="font-mono text-xs">
                          {paymentDetails.paymentDetails?.securityFingerprint ||
                            "Not available"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Payment Timeline */}
                  {paymentDetails.timeline &&
                    paymentDetails.timeline.length > 0 && (
                      <div className="border-t pt-3">
                        <h5 className="mb-2 flex items-center gap-1 font-medium">
                          <Clock size={14} />
                          Payment Timeline
                        </h5>
                        <ol className="relative border-l border-gray-300 text-sm">
                          {paymentDetails.timeline.map((event, index) => (
                            <li key={index} className="mb-4 ml-6">
                              <span className="bg-primary ring-base-200 absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8">
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                              </span>
                              <h6 className="font-medium capitalize">
                                {event.status.replace("_", " ")}
                              </h6>
                              <p className="text-gray-500">
                                {formatDate(event.timestamp)}
                              </p>
                              {event.note && (
                                <p className="mt-1 text-gray-600">
                                  {event.note}
                                </p>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
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
              Order Items ({order.items.length})
            </h4>
            <OrderItemsList
              items={order.items}
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
                <span className="text-right">৳{order.subtotal.toFixed(2)}</span>
                <span className="text-gray-600">Tax</span>
                <span className="text-right">৳{order.tax.toFixed(2)}</span>
                <span className="text-gray-600">Shipping</span>
                <span className="text-right">৳{order.shipping.toFixed(2)}</span>
                <span className="mt-1 border-t pt-2 text-base font-semibold">
                  Total
                </span>
                <span className="mt-1 border-t pt-2 text-right text-base font-semibold">
                  ৳{order.total.toFixed(2)}
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
