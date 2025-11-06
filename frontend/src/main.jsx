import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

// Layouts and Pages
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// Define your app's routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the main layout (Navbar, Footer)
    children: [
      {
        index: true, // This is the default child route (renders at /)
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      // ... Add more pages here (Product, Cart, Profile)
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </AuthProvider>
  </StrictMode>
);
