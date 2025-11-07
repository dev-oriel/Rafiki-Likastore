import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // If not loading, check if user is logged in AND is an admin
  if (user && user.isAdmin) {
    return <Outlet />; // Show the admin page
  } else {
    // If not logged in or not an admin, redirect to homepage
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
