import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // 1. Import useAuth
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";
const PLACEHOLDER = "/placeholder-400x300.png";

const ShopProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth(); // 2. Get user and toggle function

  // 3. Check if this product is in the user's favorites
  const isFavorited = user?.favorites?.some(
    (fav) => (fav._id || fav) === product._id
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // 4. New handler for toggling favorite
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product._id);
  };

  const rawImage =
    (product.images && product.images[0]) ||
    product.image ||
    product.thumbnail ||
    "";
  const imageUrl =
    rawImage && rawImage.startsWith("http")
      ? rawImage
      : `${API_BASE_URL}${rawImage}`;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 p-4 overflow-hidden">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full h-56 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={imageUrl || PLACEHOLDER}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />

          {product.isOnSale && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              On Offer
            </span>
          )}

          {/* 5. Add Favorite button */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              aria-label="Toggle favorite"
              className="absolute right-12 top-3 z-10 inline-flex items-center justify-center rounded-full bg-white/80 dark:bg-zinc-900/80 p-2 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-opacity"
              title="Toggle favorite"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{
                  fontVariationSettings: `'FILL' ${isFavorited ? 1 : 0}`,
                }}
              >
                {isFavorited ? "favorite" : "favorite_border"}
              </span>
            </button>
          )}

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full bg-amber-500 text-white p-2 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-opacity"
            title={`Add ${product.name} to cart`}
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <h3 className="text-base font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100 h-10">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            {/* (Price display - no change) */}
            <div>
              {product.isOnSale && product.discountedPrice > 0 ? (
                <>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-500">
                    {formatCurrency(product.discountedPrice)}
                  </div>
                  <div className="text-xs line-through text-zinc-400">
                    {formatCurrency(product.price)}
                  </div>
                </>
              ) : (
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>

            {/* (Rating display - no change) */}
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <span>{(product.rating ?? 4.5).toFixed(1)}</span>
              <span className="material-symbols-outlined text-amber-500 text-base">
                star
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ShopProductCard;
