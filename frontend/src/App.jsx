import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, lazy, Suspense } from "react";

// Components that are needed immediately
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const DiscountedProductsPage = lazy(
  () => import("./pages/products/DiscountedProductsPage"),
);
const ProductDetailsPage = lazy(
  () => import("./pages/products/ProductDetailsPage"),
);
const CartPage = lazy(() => import("./pages/CartPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

function App() {
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
    <div className="relative container mx-auto min-h-screen overflow-hidden">
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
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
              user &&
              (user?.role === "admin" || user?.role === "superadmin") ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Redirect all other paths to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
