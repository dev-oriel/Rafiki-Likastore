import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a blank screen or loading spinner while checking auth
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (user) {
    // If the user is logged in, redirect them away from the guest page
    // to the homepage (or '/profile' if you prefer).
    return <Navigate to="/" replace />;
  }

  // If not loading and no user, show the guest page (Login or Register)
  return <Outlet />;
};

export default GuestRoute;
