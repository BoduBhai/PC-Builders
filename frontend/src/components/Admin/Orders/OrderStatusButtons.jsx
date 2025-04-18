// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\OrderStatusButtons.jsx
import React from "react";
import { Package, Truck, CircleCheck, CircleOff } from "lucide-react";

// Component for order status buttons with consistent styling
const OrderStatusButtons = ({
  currentStatus,
  isProcessing,
  onStatusChange,
}) => {
  // Get button color styles for order status
  const getOrderStatusButtonStyle = (buttonStatus, currentStatus) => {
    if (buttonStatus === currentStatus) {
      switch (buttonStatus) {
        case "processing":
          return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
        case "shipped":
          return "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
        case "delivered":
          return "bg-emerald-500 hover:bg-emerald-600 text-white border-transparent";
        case "cancelled":
          return "bg-rose-500 hover:bg-rose-600 text-white border-transparent";
        default:
          return "bg-gray-500 hover:bg-gray-600 text-white border-transparent";
      }
    } else {
      switch (buttonStatus) {
        case "processing":
          return "bg-transparent hover:bg-amber-500 text-amber-500 hover:text-white border-amber-500";
        case "shipped":
          return "bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border-blue-500";
        case "delivered":
          return "bg-transparent hover:bg-emerald-500 text-emerald-500 hover:text-white border-emerald-500";
        case "cancelled":
          return "bg-transparent hover:bg-rose-500 text-rose-500 hover:text-white border-rose-500";
        default:
          return "bg-transparent hover:bg-gray-500 text-gray-500 hover:text-white border-gray-500";
      }
    }
  };

  // Get status icon
  const getOrderStatusIcon = (status, size = 20) => {
    switch (status) {
      case "processing":
        return <Package size={size} className="text-white" />;
      case "shipped":
        return <Truck size={size} className="text-white" />;
      case "delivered":
        return <CircleCheck size={size} className="text-white" />;
      case "cancelled":
        return <CircleOff size={size} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`btn btn-sm border ${getOrderStatusButtonStyle("processing", currentStatus)}`}
        onClick={() => onStatusChange("processing")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getOrderStatusIcon("processing", 16)}
            <span className="ml-1">Processing</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getOrderStatusButtonStyle("shipped", currentStatus)}`}
        onClick={() => onStatusChange("shipped")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getOrderStatusIcon("shipped", 16)}
            <span className="ml-1">Shipped</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getOrderStatusButtonStyle("delivered", currentStatus)}`}
        onClick={() => onStatusChange("delivered")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getOrderStatusIcon("delivered", 16)}
            <span className="ml-1">Delivered</span>
          </>
        )}
      </button>
      <button
        className={`btn btn-sm border ${getOrderStatusButtonStyle("cancelled", currentStatus)}`}
        onClick={() => onStatusChange("cancelled")}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <>
            {getOrderStatusIcon("cancelled", 16)}
            <span className="ml-1">Cancelled</span>
          </>
        )}
      </button>
    </div>
  );
};

export default OrderStatusButtons;
