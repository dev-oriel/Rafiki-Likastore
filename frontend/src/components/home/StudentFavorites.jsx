import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { Link } from "react-router-dom";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const StudentFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Call the 'favorites' endpoint
        const { data } = await api.get("/products/favorites");
        // Slice to 10 items so the slider isn't overloaded but has enough to scroll
        setFavorites((data || []).slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Don't render the section if no products were found
  if (favorites.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20">
      {/* Shared Swiper Styles (Amber Theme + Glassmorphism Arrows) */}
      <style>{`
        /* Pagination Dots */
        .swiper-pagination-bullet-active {
          background-color: #f59e0b !important;
          width: 20px !important;
          border-radius: 6px !important;
          transition: all 0.3s ease;
        }

        /* Glassmorphism Arrows */
        .swiper-button-next, .swiper-button-prev {
          color: #f59e0b !important;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(228, 228, 231, 0.6);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: #f59e0b;
          color: white !important;
          border-color: #f59e0b;
          transform: scale(1.1);
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
        }

        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: 800;
        }

        .swiper-button-disabled {
          opacity: 0 !important;
          cursor: auto;
          pointer-events: none;
        }

        @media (prefers-color-scheme: dark) {
          .dark .swiper-button-next, .dark .swiper-button-prev {
            background-color: rgba(39, 39, 42, 0.85);
            border-color: rgba(63, 63, 70, 0.6);
            color: #fbbf24 !important;
          }
          .dark .swiper-button-next:hover, .dark .swiper-button-prev:hover {
            background-color: #f59e0b;
            color: white !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Student Favorites
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Popular picks among students — value-driven, easy to enjoy, and
              perfect for social gatherings.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/10 transition-colors"
          >
            Browse all student picks
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Slider Section */}
        <div className="relative">
          {loading ? (
            // Skeleton Loading State (Grid fallback)
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4 h-80"
                >
                  <div className="h-48 rounded-lg bg-zinc-200 dark:bg-zinc-700 w-full mb-4" />
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1.2} // Mobile: 1 full + peek next
              centeredSlides={false}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                // sm: Tablet portrait
                640: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                // lg: Tablet landscape/Small Laptop
                1024: {
                  slidesPerView: 3.2,
                  spaceBetween: 24,
                },
                // xl: Desktop
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="pb-12! px-2!"
            >
              {favorites.map((product) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentFavorites;
