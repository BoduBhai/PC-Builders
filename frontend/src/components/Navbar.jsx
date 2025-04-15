import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import ThemeController from "./ThemeCTRL/ThemeController";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart, initCart } = useCartStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Initialize cart data when component mounts - works for both guest and authenticated users
  useEffect(() => {
    initCart();
  }, [initCart]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header
      className={`navbar fixed top-0 right-0 left-0 z-50 py-3 transition-all duration-300 ${
        isScrolled ? "bg-base-100 shadow-md" : "bg-base-100/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            className="btn btn-ghost btn-circle mr-2 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="btn btn-ghost px-2 text-xl font-bold">
            PC Builders
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="ml-6 hidden space-x-4 md:flex">
            <Link to="/products" className="btn btn-ghost btn-sm">
              All Products
            </Link>
            <Link to="/build-pc" className="btn btn-ghost btn-sm">
              Build PC
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart Link */}
          <Link
            to="/cart"
            className="btn btn-ghost btn-circle relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={22} />
            {/* Cart badge - show for all users, not just authenticated ones */}
            {cart.totalItems > 0 && (
              <span className="bg-primary text-primary-content absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                {cart.totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="dropdown dropdown-end ml-2">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full transition-transform hover:scale-110">
                  <img
                    alt={user?.fname || `User`}
                    src={user?.profilePicture || `/avatar.avif`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box bg-base-100 border-base-300 z-10 mt-3 w-56 border p-2 shadow-lg"
              >
                <li className="font-semibold">
                  <div className="flex flex-col items-start">
                    <span>{user?.fname || "User"}</span>
                    <span className="text-xs opacity-75">{user?.email}</span>
                  </div>
                </li>
                <hr className="my-1" />
                {isAdmin && (
                  <li>
                    <Link to="/dashboard" className="flex items-center">
                      <span className="bg-primary text-primary-content mr-2 rounded-md px-2 py-0.5 text-xs">
                        ADMIN
                      </span>{" "}
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
                <li>
                  <Link to="/cart">Shopping Cart</Link>
                </li>
                <hr className="my-1" />
                <li>
                  <button onClick={logout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary ml-2">
              Sign In
            </Link>
          )}

          {/* Theme Controller */}
          <ThemeController />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`bg-base-100 fixed inset-0 top-[61px] z-40 transform transition-transform duration-300 ease-in-out ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="bg-base-100 container mx-auto flex flex-col space-y-4 p-4">
          <Link to="/products" className="btn btn-ghost justify-start">
            All Products
          </Link>
          <Link to="/build-pc" className="btn btn-ghost justify-start">
            Build PC
          </Link>
          <Link to="/cart" className="btn btn-ghost justify-start">
            Shopping Cart
            {cart.totalItems > 0 && (
              <span className="bg-primary text-primary-content ml-2 rounded-md px-2 py-1 text-xs">
                {cart.totalItems} items
              </span>
            )}
          </Link>
          {!user && (
            <Link to="/login" className="btn btn-primary justify-start">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
