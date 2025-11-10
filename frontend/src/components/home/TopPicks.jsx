import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { Link } from "react-router-dom";

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products"); // backend returns { products: [...] }
        setTopPicks((data.products || []).slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch top picks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 sm:py-24">
      {/* 1. Use max-w-7xl for consistency */}
      <div className="mx-auto max-w-7xl px-4">
        {/* 2. Use the better header layout from StudentFavorites */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Top Picks for You
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Hand-picked selections based on popularity and quality — curated
              to help you find something great fast.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/6 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/10"
            >
              View all products
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
        {/* --- End of new header --- */}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4"
                >
                  <div className="h-56 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                  <div className="mt-4 h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
              ))
            : topPicks.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        {/* 3. Removed the old "View more" link as it's now in the header */}
      </div>
    </section>
  );
};

export default TopPicks;
