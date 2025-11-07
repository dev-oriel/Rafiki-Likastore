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

  // Protect this page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="grow px-4 sm:px-6 lg:px-8 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProfileSidebar />
          </aside>
          <section className="lg:col-span-3 space-y-8">
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
