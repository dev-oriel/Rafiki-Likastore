import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx"; // 1. Import CartProvider

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
import CheckoutPage from "./pages/CheckoutPage.jsx"; // 2. Import CheckoutPage
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx"; // 3. Import OrderSuccessPage

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // --- Public Pages ---
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:slug", element: <ProductDetailPage /> },

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
          { path: "checkout", element: <CheckoutPage /> }, // 4. Add checkout route
          { path: "order-confirmed/:id", element: <OrderSuccessPage /> }, // 5. Add success route
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* 6. Wrap the RouterProvider */}
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
