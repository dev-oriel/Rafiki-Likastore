import React, { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader, Gift } from "lucide-react";
import ShopProductCard from "../components/shop/ShopProductCard"; // We reuse the shop card

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
    <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <span className="inline-flex p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
          <Gift className="size-8 text-amber-600" />
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
          Deals & Special Offers
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          All our current on-sale items in one place. Grab them while they're
          hot!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="size-12 animate-spin text-amber-500" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-medium text-zinc-500">
            No special offers available right now.
          </p>
          <p className="text-zinc-400">Please check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map((product) => (
            <ShopProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default OffersPage;
