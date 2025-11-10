import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Users,
  Package,
  DollarSign,
  ListOrdered,
  LogOut,
  Star,
} from "lucide-react";

// Re-usable Logo
const Logo = () => (
  <svg
    className="h-full w-full"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 19.5C11 20.3284 10.3284 21 9.5 21H6.5C5.67157 21 5 20.3284 5 19.5V10H11V19.5ZM19 10H13V15.5C13 16.3284 12.3284 17 11.5 17H10.5C9.67157 17 9 16.3284 9 15.5V10H8.999C8.999 8 9 5.91899 9.001 5.614C9.018 2.625 11.231 3.443 14.502 4.043C16.89 4.493 18.981 4.972 19 5.614V10Z"></path>
  </svg>
);

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive
        ? "bg-amber-500 text-white"
        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
    }`;

  return (
    <div className="hidden lg:block w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-20 items-center border-b border-zinc-200 dark:border-zinc-800 px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white"
          >
            <span className="h-6 w-6 text-amber-500">
              <Logo />
            </span>
            <span>Rafiki Admin</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <nav className="grid items-start gap-1">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              <Package className="h-4 w-4" />
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              <ListOrdered className="h-4 w-4" />
              Orders
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              <Users className="h-4 w-4" />
              Users
            </NavLink>
            <NavLink to="/admin/transactions" className={navLinkClass}>
              <DollarSign className="h-4 w-4" />
              Transactions
            </NavLink>
            <NavLink to="/admin/reviews" className={navLinkClass}>
              <Star className="h-4 w-4" />
              Reviews
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
