import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    toast.loading("Creating product...", {
      id: "create-product",
    });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully!", {
        id: "create-product",
      });
      return res.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error creating product:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create product. Please try again.",
        {
          id: "create-product",
        },
      );
      throw error;
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
      return res.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Try logging in again.");
      set({ error: "Failed to fetch products", loading: false });
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    set({ loading: true });
    toast.loading("Updating product...", {
      id: "update-product",
    });
    try {
      const res = await axios.put(`/products/${productId}`, productData);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? { ...res.data } : product,
        ),
        loading: false,
      }));
      toast.success("Product updated successfully!", {
        id: "update-product",
      });
      return res.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error updating product:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update product. Please try again.",
        {
          id: "update-product",
        },
      );
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    toast.loading("Deleting product...", {
      id: "delete-product",
    });
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted successfully!", {
        id: "delete-product",
      });
    } catch (error) {
      set({ loading: false });
      console.error("Error deleting product:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete product. Please try again.",
        {
          id: "delete-product",
        },
      );
      throw error;
    }
  },

  toggleProductDiscount: async (productId, discountData = {}) => {
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    set({ loading: true });
    toast.loading("Updating product discount...", {
      id: "update-product-discount",
    });
    try {
      const res = await axios.patch(`/products/${productId}`, {
        discountPrice: discountData.discountPrice
          ? Number(discountData.discountPrice)
          : 0,
        discountStartDate: discountData.discountStartDate || null,
        discountEndDate: discountData.discountEndDate || null,
      });

      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? {
                ...res.data,
              }
            : product,
        ),
        loading: false,
      }));

      toast.success("Product discount updated successfully!", {
        id: "update-product-discount",
      });
      return res.data;
    } catch (error) {
      set({ loading: false });
      console.error("Error toggling product discount:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update product discount. Please try again.",
        {
          id: "update-product-discount",
        },
      );
      throw error;
    }
  },
}));
