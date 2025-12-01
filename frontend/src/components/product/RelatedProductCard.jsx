import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const RelatedProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="relative group flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Aspect-square ensures the image area is always perfect rectangle/square regardless of screen width */}
      <div className="relative w-full aspect-square bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center p-4 overflow-hidden">
        <Link
          to={`/product/${product._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <div
            className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-500 group-hover:scale-105"
            role="img"
            aria-label={product.name}
            style={{ backgroundImage: `url("${imageUrl}")` }}
          ></div>
        </Link>

        {/* On Offer Badge (Amber instead of Red) */}
        {product.isOnSale && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide shadow-sm z-10">
            Offer
          </span>
        )}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-md transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110 hover:bg-amber-600 z-10"
          title="Add to cart"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            add
          </span>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">
            {product.category}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-base font-extrabold text-amber-600 dark:text-amber-500">
            {formatCurrency(product.price)}
          </p>
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <span
              className="material-symbols-outlined text-sm text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>{(product.rating || 4.5).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCard;
