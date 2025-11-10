import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";
const PLACEHOLDER = "/placeholder-400x300.png"; // add to /public

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    // prevent navigation when clicking quick add
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // support both product.images (array) and legacy product.image (string)
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
    <article className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 p-3">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full h-56 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800">
          <img
            src={imageUrl || PLACEHOLDER}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
          />

          {/* Badges */}
          {product.isOnSale && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              SALE
            </span>
          )}
          {product.isFeatured && !product.isOnSale && (
            <span className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-2 py-1 text-xs font-medium text-white">
              Featured
            </span>
          )}

          {/* quick add */}
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full bg-amber-500 text-white p-2 opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            title={`Add ${product.name} to cart`}
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <h3 className="text-sm font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-amber-600">
                {formatCurrency(product.price)}
              </div>
              {product.discountedPrice && (
                <div className="text-xs line-through text-zinc-400">
                  {formatCurrency(product.discountedPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.788 1.402 8.176L12 18.896 4.664 23.175l1.402-8.176L.132 9.21l8.2-1.193L12 .587z" />
                </svg>
                <span>{(product.rating ?? 4.5).toFixed(1)}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
