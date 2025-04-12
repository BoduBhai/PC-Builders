import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAnalyticsStore = create((set) => ({
  analytics: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/admin/analytics");
      set({
        analytics: res.data,
        loading: false,
        error: null,
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics data");
      set({
        error: "Failed to fetch analytics",
        loading: false,
      });
      throw error;
    }
  },
}));
