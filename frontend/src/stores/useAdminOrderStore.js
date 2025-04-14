import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useAdminOrderStore = create((set) => ({
  allOrders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Fetch all orders (admin only)
  fetchAllOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/orders/admin/all");
      set({
        allOrders: res.data,
        loading: false,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      set({
        loading: false,
        error: "Failed to fetch orders. Please try again.",
      });
      toast.error("Failed to load orders");
      throw error;
    }
  },

  // Get order details (admin version)
  fetchOrderDetails: async (orderId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/orders/admin/${orderId}`);
      set({
        currentOrder: res.data,
        loading: false,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      set({
        loading: false,
        error: "Failed to fetch order details. Please try again.",
      });
      toast.error("Failed to load order details");
      throw error;
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, statusData) => {
    set({ loading: true });
    try {
      toast.loading("Updating order status...", { id: "update-order" });
      const res = await axios.patch(
        `/orders/admin/${orderId}/status`,
        statusData,
      );

      set((state) => ({
        allOrders: state.allOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: statusData.orderStatus,
                paymentStatus: statusData.paymentStatus || order.paymentStatus,
              }
            : order,
        ),
        currentOrder: res.data,
        loading: false,
      }));

      toast.success("Order status updated successfully!", {
        id: "update-order",
      });
      return res.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      set({ loading: false });
      toast.error("Failed to update order status", { id: "update-order" });
      throw error;
    }
  },

  // Clear current order
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
