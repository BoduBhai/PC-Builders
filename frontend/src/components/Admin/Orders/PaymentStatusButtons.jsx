// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\PaymentStatusButtons.jsx
import React from "react";
import { Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

// Component for payment status buttons with consistent styling
const PaymentStatusButtons = ({
  currentStatus,
  isProcessing,
  onStatusChange,
}) => {
  // Get button color styles for payment status
  const getPaymentStatusButtonStyle = (buttonStatus, currentStatus) => {
    if (buttonStatus === currentStatus) {
      switch (buttonStatus) {
        case "pending":
          return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
        case "completed":
          return "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent";
        case "failed":
          return "bg-rose-500 hover:bg-rose-600 text-white border-transparent";
        case "refunded":
          return "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
        default:
          return "bg-gray-500 hover:bg-gray-600 text-white border-transparent";
      }
    } else {
      switch (buttonStatus) {
        case "pending":
          return "bg-transparent hover:bg-amber-500 text-amber-500 hover:text-white border-amber-500";
        case "completed":
          return "bg-transparent hover:bg-emerald-500 text-emerald-500 hover:text-white border-emerald-500";
        case "failed":
          return "bg-transparent hover:bg-rose-500 text-rose-500 hover:text-white border-rose-500";
        case "refunded":
          return "bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border-blue-500";
        default:
          return "bg-transparent hover:bg-gray-500 text-gray-500 hover:text-white border-gray-500";
      }
    }
  };

  // Get payment status icon
  const getPaymentStatusIcon = (status, size = 20) => {
    switch (status) {
      case "pending":
        return <Clock size={size} className="text-white" />;
      case "completed":
        return <CheckCircle2 size={size} className="text-white" />;
      case "failed":
        return <XCircle size={size} className="text-white" />;
      case "refunded":
        return <RefreshCw size={size} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`btn btn-sm border ${getPaymentStatusButtonStyle("pending", currentStatus)}`}
        onClick={() => onStatusChange("pending")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getPaymentStatusIcon("pending", 16)}
            <span className="ml-1">Pending</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getPaymentStatusButtonStyle("completed", currentStatus)}`}
        onClick={() => onStatusChange("completed")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getPaymentStatusIcon("completed", 16)}
            <span className="ml-1">Completed</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getPaymentStatusButtonStyle("failed", currentStatus)}`}
        onClick={() => onStatusChange("failed")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getPaymentStatusIcon("failed", 16)}
            <span className="ml-1">Failed</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getPaymentStatusButtonStyle("refunded", currentStatus)}`}
        onClick={() => onStatusChange("refunded")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getPaymentStatusIcon("refunded", 16)}
            <span className="ml-1">Refunded</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentStatusButtons;
