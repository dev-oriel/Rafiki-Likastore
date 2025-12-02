import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import FavoritesCard from "../components/profile/FavoritesCard";
import OrderHistoryCard from "../components/profile/OrderHistoryCard";
import AddressesCard from "../components/profile/AddressesCard";
import PaymentMethodsCard from "../components/profile/PaymentMethodsCard";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="grow px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-zinc-50 dark:bg-black/20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar: Full width on mobile, 1 col on desktop */}
          <aside className="lg:col-span-1">
            <ProfileSidebar />
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3 space-y-6 lg:space-y-8">
            <PersonalInfoCard />
            <FavoritesCard />
            <OrderHistoryCard />
            <AddressesCard />
            <PaymentMethodsCard />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
