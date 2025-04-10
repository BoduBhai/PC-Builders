import ThemeController from "./ThemeCTRL/ThemeController";

import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const { user, logout } = useUserStore();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  return (
    <header className="navbar bg-base-100 gap-3 py-5 shadow-sm">
      <div className="flex-1">
        <div className="flex flex-col items-start gap-2 sm:flex-row">
          <Link to="/" className="btn btn-ghost text-xl">
            PC Builders
          </Link>
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-3/4 sm:w-1/2"
          />
        </div>
      </div>

      <nav className="flex items-center gap-4">
        {/* TODO : Cart do */}
        <Link to="/cart" className="relative size-8 hover:text-indigo-400">
          <ShoppingCart size="32" />

          <span className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
            3
          </span>
        </Link>

        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="size-10 rounded-full">
                {/* TODO: Add user profile image */}
                <img
                  alt={user?.name || `User`}
                  src={user?.profilePicture || `avatar1.png`}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 z-1 mt-3 w-52 gap-2 rounded-md border-1 p-2 font-bold shadow"
            >
              {isAdmin && (
                <li className="rounded-md bg-gray-600 text-teal-500">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              )}
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/logout" onClick={logout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex-none gap-2">
            <Link to="/signup">
              <button className="btn btn-success">Register</button>
            </Link>
          </div>
        )}
      </nav>

      <ThemeController />
    </header>
  );
};

export default Navbar;
