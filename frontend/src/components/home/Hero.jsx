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

  if (loading) {
    return (
      <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex justify-center items-center">
        <Loader className="animate-spin text-amber-500 h-12 w-12" />
      </section>
    );
  }

  if (heroProducts.length === 0) return null;

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
    <section className="relative w-full overflow-hidden pt-12 lg:pt-0 bg-zinc-50 dark:bg-zinc-900 selection:bg-amber-500 selection:text-white">
      {/* --- Ambient Background Blobs (Fixed positioning for visual anchor) --- */}
      <div className="absolute top-0 right-0 lg:right-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-amber-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* --- MAIN CONTAINER --- */}
      {/* Grid: 1 column on mobile (stacked), 2 columns on desktop (side-by-side) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] lg:min-h-[700px]">
          {/* --- LEFT COLUMN: Text Content --- */}
          {/* Mobile: Centered text. Desktop: Left-aligned text. */}
          <div className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left pt-8 lg:pt-0">
            <div className="space-y-4 lg:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center mx-auto lg:mx-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber-500 text-lg mr-1.5">
                  bolt
                </span>
                Fast Delivery in Kabarak
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                <span className="block">Your Friendly</span>
                <span className="block">Neighborhood</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  Liquor Stop.
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto lg:mx-0 max-w-lg text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Affordable drinks from trusted brands students love. Transparent
                pricing, student rewards, and delivery faster than your next
                class.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 hover:scale-105 hover:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                Shop Now
                <span className="material-symbols-outlined ml-2 text-xl">
                  shopping_bag
                </span>
              </Link>
              <Link
                to="/offers"
                className="inline-flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-8 py-4 text-base font-bold text-zinc-700 dark:text-zinc-200 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-amber-300"
              >
                View Offers
              </Link>
            </div>

            {/* Trust Indicators (Hidden on very small mobile to save space, visible on sm+) */}
            <div className="hidden sm:flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-lg">
                  check_circle
                </span>
                Trusted Brands
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-lg">
                  bolt
                </span>
                Instant Delivery
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: The Floating Product Stage --- */}
          {/* Mobile: Below text. Desktop: Right side. */}
          <div className="relative flex justify-center items-center perspective-1000 w-full h-[450px] sm:h-[550px] lg:h-[700px]">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-white dark:bg-zinc-800 rounded-full shadow-2xl shadow-amber-500/10 border border-zinc-100 dark:border-zinc-700/50 z-0" />

            {/* The Bottle (Animated) */}
            <div className="relative z-10 h-full w-full flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <img
                key={currentProduct._id}
                src={imageUrl}
                alt={currentProduct.name}
                className="h-[80%] lg:h-[85%] w-auto object-contain drop-shadow-2xl transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-8 zoom-in-95"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.25))",
                }}
              />
            </div>

            {/* Glassmorphism Product Card (Floating) */}
            <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 lg:bottom-20 lg:right-20 z-20 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border border-white/50 dark:border-zinc-700/50 p-4 rounded-2xl shadow-xl shadow-black/5 max-w-[200px] sm:max-w-[240px] transition-transform hover:scale-105">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-tight line-clamp-2">
                  {currentProduct.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wide">
                  {currentProduct.volume || "750ml"} •{" "}
                  {currentProduct.abv || "40% ABV"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-500">
                    {formatCurrency(currentProduct.price)}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/40 hover:bg-amber-600 hover:scale-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl">
                      add
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevProduct}
              className="absolute left-0 sm:left-4 lg:left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-md border border-white/20 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all hover:scale-110 hover:shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextProduct}
              className="absolute right-0 sm:right-4 lg:right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 dark:bg-black/20 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-md border border-white/20 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all hover:scale-110 hover:shadow-lg"
            >
              <ChevronRight size={24} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-0 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              {heroProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-8 bg-amber-500"
                      : "w-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-amber-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
}
