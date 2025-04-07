import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword, phone }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match!");
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        phone,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Something went wrong!");
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Something went wrong!");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      console.log("Error checking auth:", error.message);
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
    set({ loading: true });

    try {
      const res = await axios.put("/auth/update-profile", profileData);
      set((state) => ({
        user: {
          ...state.user,
          ...res.data,
        },
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/change-password", passwordData);
      if (response.data.user) {
        set({ user: response.data.user, loading: false });
      } else {
        set({ loading: false });
      }
      return response.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error changing password:", error);
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        // toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
