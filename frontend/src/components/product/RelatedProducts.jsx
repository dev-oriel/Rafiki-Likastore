import React, { useState, useEffect } from "react";
import RelatedProductCard from "./RelatedProductCard";
import api from "../../services/api";
import { Loader } from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const RelatedProducts = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);
        // 1. Fetch products. We use encodeURIComponent to handle spaces (e.g. "Soft Drinks")
        const { data } = await api.get(
          `/products?category=${encodeURIComponent(category)}`
        );

        // 2. ROBUST DATA HANDLING:
        // Some backends return { products: [...] }, others return just [...]
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        }

        // 3. Filter Logic:
        // a. Must not be the current product
        // b. Must match category (Client-side fallback in case backend ignores the query param)
        const filteredProducts = productsArray
          .filter((p) => p._id !== currentProductId && p.category === category)
          .slice(0, 10);

        setRelated(filteredProducts);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
          You Might Also Like
        </h2>
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-amber-500 w-8 h-8" />
        </div>
      </div>
    );
  }

  // If no related products found, hide the section
  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
        You Might Also Like
      </h2>

      <style>{`
        .swiper-pagination-bullet-active {
          background-color: #f59e0b !important;
          width: 20px !important;
          border-radius: 6px !important;
          transition: all 0.3s ease;
        }
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
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background-color: #f59e0b;
          color: white !important;
          border-color: #f59e0b;
          transform: scale(1.1);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: 800;
        }
        .swiper-button-disabled {
          opacity: 0 !important;
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

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.2}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-12! px-2!"
        >
          {related.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <RelatedProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
