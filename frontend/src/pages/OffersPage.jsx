import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader, Gift } from "lucide-react";
import ShopProductCard from "../components/shop/ShopProductCard";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products/offers");
        setOffers(data);
      } catch (err) {
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <span className="inline-flex p-3 sm:p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
          <Gift className="size-6 sm:size-8 text-amber-600 dark:text-amber-500" />
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
          Deals & Special Offers
        </h1>
        <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg text-zinc-600 dark:text-zinc-400">
          All our current on-sale items in one place. Grab them while they're
          hot!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="size-10 sm:size-12 animate-spin text-amber-500" />
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-xl font-bold text-zinc-900 dark:text-white">
            No special offers available right now.
          </p>
          <p className="text-zinc-500 mt-2">Please check back later!</p>
        </div>
      ) : (
        /* Responsive Grid:
           - grid-cols-2 on mobile (Matches ShopPage for consistency)
           - Gap-3 on mobile (tight), Gap-6 on desktop
        */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {offers.map((product) => (
            <ShopProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default OffersPage;
