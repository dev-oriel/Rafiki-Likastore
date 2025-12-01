import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";
const PLACEHOLDER = "/placeholder-400x300.png";

const ShopProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();

  const isFavorited = user?.favorites?.some(
    (fav) => (fav._id || fav) === product._id
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

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
    <article className="group relative flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container: aspect-square ensures perfect scaling on grid-cols-2 */}
      <div className="relative w-full aspect-square bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-4 overflow-hidden">
        <Link
          to={`/product/${product._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={imageUrl || PLACEHOLDER}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </Link>

        {/* On Offer Badge (Amber) */}
        {product.isOnSale && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm z-10">
            On Offer
          </span>
        )}

        {/* Action Buttons: Visible on Mobile, Hover on Desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {/* Favorite */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-sm backdrop-blur-sm text-zinc-400 hover:text-amber-500 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{
                  fontVariationSettings: `'FILL' ${isFavorited ? 1 : 0}`,
                }}
              >
                favorite
              </span>
            </button>
          )}
        </div>

        {/* Add Cart Button (Bottom Right) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-md transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 hover:bg-amber-600 z-10"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
      </div>

      {/* Details */}
      <Link
        to={`/product/${product._id}`}
        className="flex flex-col grow p-3 sm:p-4"
      >
        <div className="mb-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight min-h-[2.5em]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
            {product.category}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {product.isOnSale && product.discountedPrice > 0 ? (
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-zinc-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-500">
                  {formatCurrency(product.discountedPrice)}
                </span>
              </div>
            ) : (
              <div className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(product.price)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-xs text-zinc-500">
            <span
              className="material-symbols-outlined text-sm text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>{(product.rating ?? 4.5).toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ShopProductCard;
