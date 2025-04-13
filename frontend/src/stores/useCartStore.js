import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useUserStore } from "./useUserStore";

// Local storage key for guest cart
const GUEST_CART_KEY = "pc-builders-guest-cart";

// Helper function to get cart from localStorage
const getLocalCart = () => {
  try {
    const localCart = localStorage.getItem(GUEST_CART_KEY);
    return localCart
      ? JSON.parse(localCart)
      : { items: [], totalPrice: 0, totalItems: 0 };
  } catch (error) {
    console.error("Error parsing local cart:", error);
    return { items: [], totalPrice: 0, totalItems: 0 };
  }
};

// Helper function to save cart to localStorage
const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving local cart:", error);
  }
};

// Helper function to calculate cart totals for local cart
const calculateCartTotals = (cartItems) => {
  let totalPrice = 0;
  let totalItems = 0;

  cartItems.forEach((item) => {
    const itemPrice = item.product.onDiscount
      ? item.product.discountPrice
      : item.product.price;

    totalPrice += itemPrice * item.quantity;
    totalItems += item.quantity;
  });

  return {
    items: cartItems,
    totalPrice,
    totalItems,
  };
};

export const useCartStore = create((set, get) => ({
  cart: {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  },
  loading: false,

  // Initialize cart based on auth status
  initCart: () => {
    const user = useUserStore.getState().user;
    if (!user) {
      // If user is not logged in, load from localStorage
      const localCart = getLocalCart();
      set({ cart: localCart });
    } else {
      // If user is logged in, fetch from server
      get().fetchCart();
    }
  },

  // Merge local cart with server cart after login
  mergeLocalCartWithServerCart: async () => {
    const localCart = getLocalCart();
    if (localCart.items.length === 0) return;

    set({ loading: true });
    toast.loading("Merging your cart...", { id: "mergeCart" });

    try {
      // Add each local cart item to the server cart
      for (const item of localCart.items) {
        try {
          await axios.post("/cart/add", {
            productId: item.product._id,
            quantity: item.quantity,
          });
        } catch (error) {
          console.error("Error adding item to server cart:", error);
        }
      }

      // Clear local cart
      localStorage.removeItem(GUEST_CART_KEY);

      // Fetch the updated server cart
      await get().fetchCart();

      toast.success("Your cart has been saved to your account!", {
        id: "mergeCart",
      });
    } catch (error) {
      console.error("Error merging carts:", error);
      set({ loading: false });
      toast.error("Failed to merge your carts", { id: "mergeCart" });
    }
  },

  // Fetch cart items
  fetchCart: async () => {
    const user = useUserStore.getState().user;

    // If not logged in, use local cart
    if (!user) {
      const localCart = getLocalCart();
      set({ cart: localCart });
      return localCart;
    }

    set({ loading: true });
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data, loading: false });
      return res.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ loading: false });

      if (error.response?.status === 401) {
        // If auth error but we have items in local storage
        const localCart = getLocalCart();
        set({ cart: localCart });
        return localCart;
      } else {
        toast.error("Failed to fetch cart. Please try again.");
      }

      return get().cart; // Return current cart if error
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const user = useUserStore.getState().user;

    // If not logged in, add to local cart
    if (!user) {
      set({ loading: true });

      try {
        toast.loading("Adding to cart...", { id: "addToCart" });

        // Get product details first
        const res = await axios.get(`/products/${productId}`);
        const product = res.data;

        // Validate stock
        if (!product.stock) {
          toast.error("This product is out of stock", { id: "addToCart" });
          set({ loading: false });
          return get().cart;
        }

        // Get current local cart
        const localCart = getLocalCart();

        // Check if product already in cart
        const existingItemIndex = localCart.items.findIndex(
          (item) => item.product._id === productId,
        );

        if (existingItemIndex > -1) {
          // Update quantity if exists
          const newQuantity =
            localCart.items[existingItemIndex].quantity + quantity;

          // Check stock limit
          if (newQuantity > product.stock) {
            toast.error("Cannot add more of this item (stock limit reached)", {
              id: "addToCart",
            });
            set({ loading: false });
            return localCart;
          }

          localCart.items[existingItemIndex].quantity = newQuantity;
        } else {
          // Add new product to cart
          localCart.items.push({
            product: {
              _id: product._id,
              modelNo: product.modelNo,
              description: product.description,
              price: product.price,
              image: product.image,
              stock: product.stock,
              category: product.category,
              brand: product.brand,
              onDiscount: product.onDiscount,
              discountPrice: product.discountPrice,
            },
            quantity,
          });
        }

        // Recalculate totals
        const updatedCart = calculateCartTotals(localCart.items);

        // Save to localStorage
        saveLocalCart(updatedCart);

        // Update store state
        set({
          cart: updatedCart,
          loading: false,
        });

        toast.success("Item added to cart", { id: "addToCart" });
        return updatedCart;
      } catch (error) {
        set({ loading: false });
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart", { id: "addToCart" });
        return get().cart;
      }
    }

    // If logged in, use server cart
    set({ loading: true });

    try {
      toast.loading("Adding to cart...", { id: "addToCart" });

      const res = await axios.post("/cart/add", { productId, quantity });

      set({
        cart: res.data,
        loading: false,
      });

      toast.success("Item added to cart", { id: "addToCart" });
      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Error adding to cart:", error);

      if (error.response?.status === 401) {
        toast.error("Please log in to add items to cart", { id: "addToCart" });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: "addToCart" });
      } else {
        toast.error("Failed to add item to cart", { id: "addToCart" });
      }

      throw error;
    }
  },

  // Update cart item quantity
  updateQuantity: async (productId, quantity) => {
    const user = useUserStore.getState().user;

    // If not logged in, update local cart
    if (!user) {
      set({ loading: true });

      try {
        toast.loading("Updating cart...", { id: "updateCart" });

        // Get local cart
        const localCart = getLocalCart();

        // Find item
        const itemIndex = localCart.items.findIndex(
          (item) => item.product._id === productId,
        );

        if (itemIndex === -1) {
          toast.error("Item not found in cart", { id: "updateCart" });
          set({ loading: false });
          return localCart;
        }

        // Check stock
        if (quantity > localCart.items[itemIndex].product.stock) {
          toast.error("Requested quantity exceeds available stock", {
            id: "updateCart",
          });
          set({ loading: false });
          return localCart;
        }

        // Update quantity
        localCart.items[itemIndex].quantity = quantity;

        // Recalculate totals
        const updatedCart = calculateCartTotals(localCart.items);

        // Save to localStorage
        saveLocalCart(updatedCart);

        // Update store state
        set({
          cart: updatedCart,
          loading: false,
        });

        toast.success("Cart updated", { id: "updateCart" });
        return updatedCart;
      } catch (error) {
        set({ loading: false });
        console.error("Error updating cart:", error);
        toast.error("Failed to update cart", { id: "updateCart" });
        return get().cart;
      }
    }

    // If logged in, use server cart
    set({ loading: true });

    try {
      toast.loading("Updating cart...", { id: "updateCart" });

      const res = await axios.put("/cart/update", { productId, quantity });

      set({
        cart: res.data,
        loading: false,
      });

      toast.success("Cart updated", { id: "updateCart" });
      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Error updating cart:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: "updateCart" });
      } else {
        toast.error("Failed to update cart", { id: "updateCart" });
      }

      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const user = useUserStore.getState().user;

    // If not logged in, remove from local cart
    if (!user) {
      set({ loading: true });

      try {
        toast.loading("Removing item...", { id: "removeItem" });

        // Get local cart
        let localCart = getLocalCart();

        // Filter out the item to remove
        localCart.items = localCart.items.filter(
          (item) => item.product._id !== productId,
        );

        // Recalculate totals
        const updatedCart = calculateCartTotals(localCart.items);

        // Save to localStorage
        saveLocalCart(updatedCart);

        // Update store state
        set({
          cart: updatedCart,
          loading: false,
        });

        toast.success("Item removed", { id: "removeItem" });
        return updatedCart;
      } catch (error) {
        set({ loading: false });
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove item", { id: "removeItem" });
        return get().cart;
      }
    }

    // If logged in, use server cart
    set({ loading: true });

    try {
      toast.loading("Removing item...", { id: "removeItem" });

      const res = await axios.delete(`/cart/remove/${productId}`);

      set({
        cart: res.data,
        loading: false,
      });

      toast.success("Item removed", { id: "removeItem" });
      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Error removing from cart:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: "removeItem" });
      } else {
        toast.error("Failed to remove item", { id: "removeItem" });
      }

      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    const user = useUserStore.getState().user;

    // If not logged in, clear local cart
    if (!user) {
      set({ loading: true });

      try {
        toast.loading("Clearing cart...", { id: "clearCart" });

        // Clear localStorage
        const emptyCart = { items: [], totalPrice: 0, totalItems: 0 };
        saveLocalCart(emptyCart);

        // Update store state
        set({
          cart: emptyCart,
          loading: false,
        });

        toast.success("Cart cleared", { id: "clearCart" });
        return emptyCart;
      } catch (error) {
        set({ loading: false });
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart", { id: "clearCart" });
        return get().cart;
      }
    }

    // If logged in, use server cart
    set({ loading: true });

    try {
      toast.loading("Clearing cart...", { id: "clearCart" });

      const res = await axios.delete("/cart/clear");

      set({
        cart: {
          items: [],
          totalPrice: 0,
          totalItems: 0,
        },
        loading: false,
      });

      toast.success("Cart cleared", { id: "clearCart" });
      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Error clearing cart:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: "clearCart" });
      } else {
        toast.error("Failed to clear cart", { id: "clearCart" });
      }

      throw error;
    }
  },
}));
