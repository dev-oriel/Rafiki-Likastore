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
    // --- THIS IS THE FIX ---
    // If a user is logged in, redirect them based on their role.
    return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/"} replace />;
  }

  // If not loading and no user, show the guest page (Login or Register)
  return <Outlet />;
};

export default GuestRoute;
