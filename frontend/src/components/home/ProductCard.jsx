import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";
const PLACEHOLDER = "/placeholder-400x300.png";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user, toggleFavorite } = useAuth();

  const isFavorited = user?.favorites?.some(
    (fav) => (fav._id || fav) === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <article className="group relative flex flex-col h-full w-full rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <Link to={`/product/${product._id}`} className="h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full pt-[100%] sm:pt-[80%] overflow-hidden bg-zinc-50 dark:bg-zinc-800/50">
          <img
            src={imageUrl || PLACEHOLDER}
            alt={product.name}
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />

          {product.isOnSale && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-500 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              On Offer
            </span>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {/* Favorite Button */}
            {user && (
              <button
                onClick={handleToggleFavorite}
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-md transition-all hover:bg-amber-50 hover:text-amber-500 focus:outline-none 
                opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0 duration-300"
                title="Toggle favorite"
              >
                <span
                  className="material-symbols-outlined text-[18px] sm:text-[20px]"
                  style={{
                    fontVariationSettings: `'FILL' ${
                      isFavorited ? 1 : 0
                    }, 'wght' 400`,
                  }}
                >
                  favorite
                </span>
              </button>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 text-white shadow-md transition-all hover:bg-amber-600 focus:outline-none 
              opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0 delay-75 duration-300"
              title="Add to cart"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                shopping_cart
              </span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col grow p-4">
          <h3 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 min-h-[2.5rem] mb-2">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              {product.isOnSale && product.discountedPrice > 0 ? (
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-500">
                    {formatCurrency(product.discountedPrice)}
                  </span>
                </div>
              ) : (
                <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
              <span className="material-symbols-outlined text-amber-400 text-sm fill-current">
                star
              </span>
              <span>{(product.rating ?? 4.5).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
