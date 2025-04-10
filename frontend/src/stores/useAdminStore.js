import { create } from "zustand";
import axios from "../lib/axios";

export const useAdminStore = create((set) => ({
  user: null,
  loading: false,
  users: [],

  getAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/admin/all-users");
      set({ users: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/admin/${userId}`);
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  toggleRole: async (userId) => {
    set({ loading: true });
    try {
      const response = await axios.post(`/admin/toggle-role/${userId}`);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, role: response.data.role } : user,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      await axios.delete(`/admin/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      console.error("Error deleting user:", error);
      throw error;
    }
  },
}));
