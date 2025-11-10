import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Layouts and Pages
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OffersPage from "./pages/OffersPage.jsx";

// --- Admin Imports ---
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProductList from "./pages/admin/AdminProductList.jsx";
import AdminProductEdit from "./pages/admin/AdminProductEdit.jsx";
import AdminOrderList from "./pages/admin/AdminOrderList.jsx";
import AdminUserList from "./pages/admin/AdminUserList.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Your main app layout (Navbar, Footer)
    children: [
      // --- Public Pages ---
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "offers", element: <OffersPage /> },

      // --- Guest-Only Pages ---
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      // --- Protected Pages ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "my-orders", element: <MyOrdersPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "order-confirmed/:id", element: <OrderSuccessPage /> },
        ],
      },
    ],
  },

  // --- ADMIN ROUTES ---
  {
    path: "/admin",
    element: <AdminRoute />, // 1. Protect all routes under /admin
    children: [
      {
        element: <AdminLayout />, // 2. Use the new admin layout
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "products", element: <AdminProductList /> },
          { path: "products/create", element: <AdminProductEdit /> }, // Create
          { path: "products/:id/edit", element: <AdminProductEdit /> }, // Edit
          { path: "orders", element: <AdminOrderList /> },
          { path: "users", element: <AdminUserList /> },
          { path: "transactions", element: <AdminTransactions /> },
          { path: "reviews", element: <AdminReviews /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
