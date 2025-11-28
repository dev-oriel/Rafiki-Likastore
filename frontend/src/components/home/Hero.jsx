import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

export default function Hero() {
  const [heroProducts, setHeroProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (data.products && data.products.length > 0) {
          setHeroProducts(data.products.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch hero products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroProducts();
  }, []);

  const nextProduct = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === heroProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevProduct = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? heroProducts.length - 1 : prevIndex - 1
    );
  };

  // Loading View
  if (loading) {
    return (
      <section className="relative w-full h-[500px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex justify-center items-center">
        <Loader className="animate-spin text-amber-500 h-12 w-12" />
      </section>
    );
  }

  // Empty View (if fetch fails or no products)
  if (heroProducts.length === 0) {
    return null;
  }

  const currentProduct = heroProducts[activeIndex];
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");
  const imageUrl = currentProduct.image.startsWith("http")
    ? currentProduct.image
    : `${API_BASE_URL}${currentProduct.image}`;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(currentProduct);
    toast.success(`${currentProduct.name} added to cart!`);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-linear-to-br from-amber-50 via-white to-amber-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
    >
      <div className="container mx-auto px-6 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
            >
              <span className="block">Your Friendly Neighborhood</span>
              <span className="block bg-linear-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                Liquor Stop — delivered fast.
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-base text-zinc-600 dark:text-zinc-300 md:text-lg lg:mx-0">
              Affordable drinks from trusted brands students love. Fast
              delivery, transparent pricing — and a rewards program that
              actually rewards you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-amber-300"
                aria-label="Shop now — open shop page"
              >
                Shop Now
                <svg
                  className="ml-3 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                to="/offers"
                className="mx-auto inline-flex items-center justify-center rounded-full border border-amber-200 px-5 py-3 text-sm font-semibold text-amber-700 shadow-sm bg-white/60 backdrop-blur-sm transition hover:bg-amber-50 sm:mx-0 dark:bg-zinc-800/60 dark:text-amber-400"
                aria-label="See current offers"
              >
                View Offers
              </Link>
            </div>

            <ul className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Free delivery •
                </span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Trusted brands •
                </span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Student discounts
                </span>
              </li>
            </ul>
          </div>

          {/* Dynamic Image Display with Toggle */}
          <div className="relative flex min-h-[400px] items-center justify-center lg:min-h-[500px]">
            <button
              onClick={prevProduct}
              aria-label="Previous product"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm shadow-md transition hover:scale-105"
            >
              <ChevronLeft className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </button>
            <button
              onClick={nextProduct}
              aria-label="Next product"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm shadow-md transition hover:scale-105"
            >
              <ChevronRight className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </button>

            <div className="relative w-full h-full flex justify-center items-center">
              <div className="relative z-10 p-6 rounded-2xl bg-white/60 shadow-2xl backdrop-blur-md dark:bg-zinc-900/60 flex flex-col justify-end min-h-[300px] lg:min-h-[400px] w-80 sm:w-96">
                <img
                  src={imageUrl}
                  alt={currentProduct.name}
                  className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 h-full object-contain max-h-[500px] w-auto transition-transform duration-300 ease-in-out hover:scale-105 z-0 -rotate-12"
                />
                <div className="mt-auto relative z-10 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl backdrop-blur-sm">
                  <p className="text-xl font-medium text-zinc-800 dark:text-zinc-100">
                    {currentProduct.name}
                  </p>
                  <p className="text-base text-zinc-500 dark:text-zinc-400">
                    {currentProduct.volume || "750ml"} •{" "}
                    {currentProduct.abv || "40% ABV"}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-semibold text-amber-600">
                      {formatCurrency(currentProduct.price)}
                    </p>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center rounded-full bg-amber-500 text-white p-2 shadow-md transition-transform hover:scale-110"
                      title={`Add ${currentProduct.name} to cart`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-amber-500 w-4"
                      : "bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-6 h-6 w-full rounded-full blur-3xl opacity-40 bg-linear-to-r from-amber-200 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
