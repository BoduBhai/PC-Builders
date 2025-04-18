import { useState, useEffect } from "react";
import { useAdminOrderStore } from "../../stores/useAdminOrderStore";
import { CheckCircle2 } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

// Import modularized components
import OrdersFilterBar from "../../components/Admin/Orders/OrdersFilterBar";
import OrderDetailsModal from "../../components/Admin/Orders/OrderDetailsModal";
import OrdersTable from "../../components/Admin/Orders/OrdersTable";

const AdminOrdersPage = () => {
  const { allOrders, fetchAllOrders, updateOrderStatus, loading } =
    useAdminOrderStore();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // Fetch orders on component mount
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

  // Clear status update success message after 3 seconds
  useEffect(() => {
    if (statusUpdateSuccess) {
      const timer = setTimeout(() => {
        setStatusUpdateSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusUpdateSuccess]);

  // Toggle item expansion in order details
  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Update current order when it changes in the allOrders array
  useEffect(() => {
    if (currentOrder && allOrders) {
      const updatedOrder = allOrders.find(
        (order) => order._id === currentOrder._id,
      );
      if (updatedOrder) {
        setCurrentOrder(updatedOrder);
      }
    }
  }, [allOrders, currentOrder]);

  // Handle opening order details modal
  const handleViewOrderDetails = (order) => {
    setCurrentOrder(order);
    // Reset expanded items when viewing a new order
    setExpandedItems({});

    // Use setTimeout to ensure the component has re-rendered with the new order data
    setTimeout(() => {
      const modal = document.getElementById("order_details_modal");
      if (modal) {
        modal.showModal();
      } else {
        console.error("Modal element not found");
      }
    }, 0);
  };

  // Close modal
  const closeModal = () => {
    const modal = document.getElementById("order_details_modal");
    if (modal) {
      modal.close();
    }
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { orderStatus });
      setStatusUpdateSuccess(`Order status updated to ${orderStatus}`);
      // Update the current order directly for immediate UI feedback
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder({
          ...currentOrder,
          orderStatus,
        });
      }
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
      setStatusUpdateSuccess(`Payment status updated to ${paymentStatus}`);
      // Update the current order directly for immediate UI feedback
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder({
          ...currentOrder,
          paymentStatus,
        });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Show loading spinner while initially loading
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

      {/* Status Update Success Toast */}
      {statusUpdateSuccess && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <CheckCircle2 size={20} />
            <span>{statusUpdateSuccess}</span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <OrdersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        setSelectedPaymentStatus={setSelectedPaymentStatus}
        onRefresh={fetchAllOrders}
        loading={loading}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onViewOrder={handleViewOrderDetails}
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        selectedPaymentStatus={selectedPaymentStatus}
        setSearchQuery={setSearchQuery}
        setSelectedStatus={setSelectedStatus}
        setSelectedPaymentStatus={setSelectedPaymentStatus}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={currentOrder}
        closeModal={closeModal}
        processingOrderId={processingOrderId}
        expandedItems={expandedItems}
        toggleItemExpansion={toggleItemExpansion}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        handleUpdatePaymentStatus={handleUpdatePaymentStatus}
      />
    </div>
  );
};

export default AdminOrdersPage;
