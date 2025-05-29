import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Components that are needed immediately
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";

// Direct imports instead of lazy loading
import HomePage from "./pages/Homepage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminManagementPage from "./pages/admin/AdminManagementPage";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import DiscountedProductsPage from "./pages/products/DiscountedProductsPage";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";
import PreBuiltPCPage from "./pages/products/PreBuiltPCPage";
import CartPage from "./pages/CartPage";
import BuildPCPage from "./pages/BuildPCPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import useScrollToTop from "./components/ThemeCTRL/useScrollTop";

function App() {
  useScrollToTop();
  const { user, checkingAuth, checkAuth } = useUserStore();
  const { initCart } = useCartStore();

  useEffect(() => {
    if (!user) {
      checkAuth();
    }

    const handlePageShow = (event) => {
      if (event.persisted && !user) {
        checkAuth();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [checkAuth, user]);

  useEffect(() => {
    if (!checkingAuth) {
      initCart();
    }
  }, [checkingAuth, user, initCart]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto mt-28 mb-8 flex-grow overflow-hidden md:mt-30 md:mb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/discounted-products"
            element={<DiscountedProductsPage />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/build-pc" element={<BuildPCPage />} />
          <Route path="/products/pre-built-pc" element={<PreBuiltPCPage />} />

          {/* Checkout and Orders */}
          <Route
            path="/checkout"
            element={user ? <CheckoutPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              user ? <OrderConfirmationPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" />}
          />

          {/* Admin */}
          <Route
            path="/dashboard"
            element={
              user &&
              (user?.role === "admin" || user?.role === "superadmin") ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/management"
            element={
              user &&
              (user?.role === "admin" || user?.role === "superadmin") ? (
                <AdminManagementPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Redirect all other paths to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
