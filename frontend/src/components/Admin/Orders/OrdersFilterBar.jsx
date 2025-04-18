// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\components\Admin\Orders\OrdersFilterBar.jsx
import React from "react";
import { Search, RefreshCw } from "lucide-react";

/**
 * Orders filter bar component with search and status filters
 */
const OrdersFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
  onRefresh,
  loading,
}) => {
  return (
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
          <Search className="absolute top-3 right-3 text-gray-400" size={20} />
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
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xl" />
        ) : (
          <>
            <RefreshCw size={18} />
            Refresh Orders
          </>
        )}
      </button>
    </div>
  );
};

export default OrdersFilterBar;
