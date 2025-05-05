import { Clock, Package, CheckCircle, XCircle } from "lucide-react";

/**
 * Component for the order status tabs
 */
const OrderStatusTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center">
      <div className="tabs-boxed bg-base-300 rounded-box flex w-full flex-wrap justify-evenly gap-1 p-2 shadow-md md:gap-2">
        <button
          onClick={() => onTabChange("all")}
          className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
            activeTab === "all"
              ? "text-primary border-primary border-b-2"
              : "hover:bg-base-200"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => onTabChange("processing")}
          className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
            activeTab === "processing"
              ? "text-primary border-primary border-b-2"
              : "hover:bg-base-200"
          }`}
        >
          <Clock
            className={`size-4 md:size-5 ${activeTab === "processing" ? "text-primary" : ""}`}
          />
          Processing
        </button>
        <button
          onClick={() => onTabChange("shipped")}
          className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
            activeTab === "shipped"
              ? "text-primary border-primary border-b-2"
              : "hover:bg-base-200"
          }`}
        >
          <Package
            className={`size-4 md:size-5 ${activeTab === "shipped" ? "text-primary" : ""}`}
          />
          Shipped
        </button>
        <button
          onClick={() => onTabChange("delivered")}
          className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
            activeTab === "delivered"
              ? "text-primary border-primary border-b-2"
              : "hover:bg-base-200"
          }`}
        >
          <CheckCircle
            className={`size-4 md:size-5 ${activeTab === "delivered" ? "text-primary" : ""}`}
          />
          Delivered
        </button>
        <button
          onClick={() => onTabChange("cancelled")}
          className={`tab tab-lg flex items-center gap-2 font-medium transition-all duration-300 md:font-bold ${
            activeTab === "cancelled"
              ? "text-primary border-primary border-b-2"
              : "hover:bg-base-200"
          }`}
        >
          <XCircle
            className={`size-4 md:size-5 ${activeTab === "cancelled" ? "text-primary" : ""}`}
          />
          Cancelled
        </button>
      </div>
    </div>
  );
};

export default OrderStatusTabs;
