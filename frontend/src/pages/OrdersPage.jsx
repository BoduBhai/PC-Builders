import { useEffect, useState } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import LoadingSpinner from "../components/LoadingSpinner";

// Import modular components
import UserOrdersTable from "../components/User/Orders/UserOrdersTable";
import OrderDetailsModal from "../components/User/Orders/OrderDetailsModal";
import OrderStatusTabs from "../components/User/Orders/OrderStatusTabs";
import CancelOrderModal from "../components/User/Orders/CancelOrderModal";

const OrdersPage = () => {
  const { orders, loading, fetchUserOrders, cancelOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // State for modal management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Filter orders based on activeTab and search query
  useEffect(() => {
    if (!orders) return;

    const filtered = orders.filter((order) => {
      // Status filter
      const statusMatch =
        activeTab === "all" || order.orderStatus === activeTab;

      // Search query filter
      const searchMatch =
        searchQuery === "" ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchQuery]);

  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    document.getElementById("cancel_order_modal").showModal();
  };

  const confirmCancelOrder = async () => {
    try {
      await cancelOrder(cancellingOrderId);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancellingOrderId(null);
      document.getElementById("cancel_order_modal").close();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  // Modal handlers
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading && !orders.length) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <h1 className="mb-6 text-center text-2xl font-bold uppercase md:text-4xl">
          My Orders
        </h1>

        {/* Status Filter Tabs */}
        <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Orders Table Card */}
        <div className="card bg-base-300 my-8 rounded-lg p-4 shadow-lg">
          <div className="card-body p-0">
            <div className="card bg-base-100">
              <div className="card-body p-0">
                <UserOrdersTable
                  orders={orders}
                  filteredOrders={filteredOrders}
                  loading={loading}
                  searchQuery={searchQuery}
                  activeTab={activeTab}
                  onSearchChange={setSearchQuery}
                  onCancelOrder={handleCancelOrder}
                  onViewOrderDetails={handleViewOrderDetails}
                  cancellingOrderId={cancellingOrderId}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={closeModal}
          onCancelOrder={handleCancelOrder}
          cancellingOrderId={cancellingOrderId}
        />

        {/* Cancel Order Confirmation Modal */}
        <CancelOrderModal
          orderId={cancellingOrderId}
          orders={orders}
          loading={loading}
          onConfirm={confirmCancelOrder}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
