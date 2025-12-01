import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { Link } from "react-router-dom";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Removed Autoplay
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products");
        // Ensure enough items for scrolling
        setTopPicks((data.products || []).slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch top picks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-10 sm:py-16 overflow-hidden">
      {/* Custom Styles for Clean Arrows & Pagination */}
      <style>{`
  /* Pagination Dots - Amber Theme */
  .swiper-pagination-bullet-active {
    background-color: #f59e0b !important;
    width: 20px !important;
    border-radius: 6px !important;
    transition: all 0.3s ease;
  }

  /* * ARROW STYLING 
   * "Glassmorphism" Effect: Semi-transparent white with blur
   */
  .swiper-button-next, .swiper-button-prev {
    color: #f59e0b !important;       /* Amber-500 icon */
    background-color: rgba(255, 255, 255, 0.85); /* 85% opacity white */
    backdrop-filter: blur(4px);      /* Blurs content behind the arrow */
    border: 1px solid rgba(228, 228, 231, 0.6); /* Zinc-200 subtle border */
    
    width: 36px;                     /* A bit larger than 30px for easier clicking */
    height: 36px;
    border-radius: 50%;
    
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Soft shadow */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smooth 'spring' animation */
    
    /* Center the icon perfectly */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Hover State: Pops with color */
  .swiper-button-next:hover, .swiper-button-prev:hover {
    background-color: #f59e0b;       /* Solid Amber fill */
    color: white !important;         /* Icon turns white */
    border-color: #f59e0b;
    transform: scale(1.1);           /* Slight grow effect */
    box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3); /* Amber glow */
  }

  /* Icon Size Adjustment */
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 16px !important;      /* Crisp, smaller icon size */
    font-weight: 800;
  }

  /* Hide disabled arrows completely */
  .swiper-button-disabled {
    opacity: 0 !important;
    cursor: auto;
    pointer-events: none;
  }

  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .dark .swiper-button-next, .dark .swiper-button-prev {
      background-color: rgba(39, 39, 42, 0.85); /* Zinc-800 semi-transparent */
      border-color: rgba(63, 63, 70, 0.6);      /* Zinc-700 border */
      color: #fbbf24 !important;                /* Amber-400 icon */
    }
    .dark .swiper-button-next:hover, .dark .swiper-button-prev:hover {
      background-color: #f59e0b;
      color: white !important;
    }
  }
`}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Top Picks for You
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
              Hand-picked selections based on popularity and quality.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/10 transition-colors"
          >
            View all products
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4 h-80"
                >
                  <div className="h-48 rounded-lg bg-zinc-200 dark:bg-zinc-700 w-full mb-4" />
                  <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]} // Removed Autoplay
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 3.2, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="pb-12! px-2!"
            >
              {topPicks.map((product) => (
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

export default TopPicks;
