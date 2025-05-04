// filepath: c:\Users\HP\Desktop\PC-Builders\frontend\src\stores\usePaymentService.js
import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const usePaymentService = create((set) => ({
  loading: false,
  error: null,
  validationResult: null,

  // Validate payment with server-side security checks
  validatePayment: async (paymentMethod, paymentData) => {
    set({ loading: true, error: null, validationResult: null });
    try {
      const res = await axios.post("/orders/validate-payment", {
        paymentMethod,
        paymentData,
      });

      set({
        loading: false,
        validationResult: res.data,
      });

      return res.data;
    } catch (error) {
      console.error("Payment validation error:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to validate payment",
      });
      toast.error(
        error.response?.data?.message || "Failed to validate payment",
      );
      throw error;
    }
  },

  // Get enhanced payment details for an order (admin only)
  getOrderPaymentDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/orders/admin/${orderId}/payment-details`);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to fetch payment details",
      });
      toast.error("Failed to fetch payment details");
      throw error;
    }
  },

  // Track suspicious payment activity
  detectSuspiciousActivity: (attempts, timestamps) => {
    // Check for too many attempts in a short time
    if (attempts >= 3 && timestamps.length >= 3) {
      const now = new Date();
      const threeMinutesAgo = new Date(now - 3 * 60 * 1000);

      // Count attempts in the last 3 minutes
      const recentAttempts = timestamps.filter(
        (time) => time > threeMinutesAgo,
      );

      if (recentAttempts.length >= 3) {
        return true; // Suspicious activity detected
      }
    }
    return false;
  },

  // Reset payment state
  resetPaymentState: () => {
    set({ loading: false, error: null, validationResult: null });
  },
}));

export default usePaymentService;
