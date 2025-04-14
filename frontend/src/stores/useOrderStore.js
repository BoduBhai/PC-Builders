import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Create a new order
  createOrder: async (orderData) => {
    set({ loading: true });
    try {
      toast.loading("Processing your order...", { id: "create-order" });
      const res = await axios.post("/orders/create", orderData);
      set({
        currentOrder: res.data,
        loading: false,
      });
      toast.success("Order placed successfully!", { id: "create-order" });
      return res.data;
    } catch (error) {
      console.error("Error creating order:", error);
      set({ loading: false });

      const errorMessage =
        error?.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast.error(errorMessage, { id: "create-order" });
      throw error;
    }
  },

  // Get all orders for current user
  fetchUserOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/orders/my-orders");
      set({
        orders: res.data,
        loading: false,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({
        loading: false,
        error: "Failed to fetch orders. Please try again.",
      });
      toast.error("Failed to load your orders");
      throw error;
    }
  },

  // Get a specific order by ID
  fetchOrderById: async (orderId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/orders/${orderId}`);
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

  // Clear current order (used after viewing order confirmation)
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
