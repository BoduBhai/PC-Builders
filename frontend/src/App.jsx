import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import DiscountedProductsPage from "./pages/products/DiscountedProductsPage";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";

import { useUserStore } from "./stores/useUserStore";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { user, checkingAuth, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="relative container mx-auto min-h-screen overflow-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        {/* <Route path="/cart" element={<CartPage />} /> */}
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

        {/* Admin */}
        <Route
          path="/dashboard"
          element={
            user && (user?.role === "admin" || user?.role === "superadmin") ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Redirect all other paths to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
