import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  discountedProducts: [],
  similarProducts: [],
  loading: false,
  discountedProductsPage: 1,
  discountedProductsTotal: 0,
  discountedProductsLimit: 9, // Number of items per page
  currentProduct: null,

  setProducts: (products) => set({ products }),

  fetchProductById: async (productId) => {
    if (!productId) {
      toast.error("Invalid product ID");
      return null;
    }

    set({ loading: true });
    try {
      // First try to find the product in the existing products array
      let product = null;
      const state = get();

      if (state.products && state.products.length > 0) {
        product = state.products.find((p) => p._id === productId);
      }

      if (
        !product &&
        state.discountedProducts &&
        state.discountedProducts.length > 0
      ) {
        product = state.discountedProducts.find((p) => p._id === productId);
      }

      // If found in local state, use that to avoid an extra API call
      if (product) {
        set({ currentProduct: product, loading: false });
        return product;
      }

      // If not found locally, fetch from API
      const res = await axios.get(`/products/${productId}`);
      set({ currentProduct: res.data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false, currentProduct: null });
      console.error("Error fetching product details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch product details",
      );
      throw error;
    }
  },

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

  fetchDiscountedProducts: async (page = null, limit = null) => {
    set({ loading: true });
    try {
      // If page is provided, we're using pagination; otherwise just get all discounted products
      if (page !== null) {
        const pageToFetch = page || 1;
        const limitToFetch = limit || 9;

        const res = await axios.get(
          `/products/discounted-products?page=${pageToFetch}&limit=${limitToFetch}`,
        );
        set({
          discountedProducts: res.data.products,
          discountedProductsTotal: res.data.total,
          discountedProductsPage: pageToFetch,
          discountedProductsLimit: limitToFetch,
          loading: false,
        });
        return res.data;
      } else {
        // Original behavior for the homepage preview
        const res = await axios.get("/products/discounted-products");
        set({ discountedProducts: res.data, loading: false });
        return res.data;
      }
    } catch (error) {
      console.error("Error fetching discounted products:", error);
      toast.error("Failed to fetch discounted products. Try logging in again.");
      set({ error: "Failed to fetch discounted products", loading: false });
      throw error;
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
      return res.data.products;
    } catch (error) {
      console.error(`Error fetching ${category} products:`, error);
      set({ error: `Failed to fetch ${category} products`, loading: false });
      throw error;
    }
  },

  fetchSimilarProducts: async (productId, category, limit = 8) => {
    if (!productId || !category) return [];

    try {
      const res = await axios.get(
        `/products/category/${category}?limit=${limit}`,
      );
      // Filter out the current product from similar products
      const filtered = res.data.products.filter((p) => p._id !== productId);
      set({ similarProducts: filtered });
      return filtered;
    } catch (error) {
      console.error("Error fetching similar products:", error);
      return [];
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
