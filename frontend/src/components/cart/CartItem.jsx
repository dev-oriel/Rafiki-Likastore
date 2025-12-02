import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `${API_BASE_URL}${item.image}`;

  const priceToUse =
    item.isOnSale && item.discountedPrice > 0
      ? item.discountedPrice
      : item.price;

  return (
    <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 rounded-xl p-2.5 sm:p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      {/* 1. IMAGE (Fixed small size on mobile to save space) */}
      <Link to={`/product/${item._id}`} className="shrink-0">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center p-1">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>
      </Link>

      {/* 2. CONTENT AREA (Grows to fill space) */}
      <div className="flex flex-col grow min-w-0 justify-between sm:justify-center h-full sm:h-24 py-0.5">
        {/* Top Row: Title & Remove Button */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <Link
              to={`/product/${item._id}`}
              className="block hover:text-amber-600 transition-colors"
            >
              <h3 className="text-xs sm:text-base font-bold text-zinc-900 dark:text-gray-100 truncate leading-tight">
                {item.name}
              </h3>
            </Link>
            <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-gray-400 font-medium">
              {formatCurrency(priceToUse)}
            </p>
          </div>

          {/* Remove Button (Icon only to save space) */}
          <button
            onClick={() => onRemove(item._id)}
            className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 -mt-1 -mr-1 p-1 shrink-0"
            aria-label="Remove"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              close
            </span>
          </button>
        </div>

        {/* Bottom Row: Quantity & Total Price */}
        <div className="flex items-center justify-between mt-2 sm:mt-auto">
          {/* Compact Quantity Control */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-md h-6 sm:h-8">
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              className="w-6 h-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-l-md text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <span className="text-xs sm:text-sm font-bold">-</span>
            </button>
            <span className="w-6 text-center text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              className="w-6 h-full flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-r-md text-zinc-600 dark:text-zinc-300"
            >
              <span className="text-xs sm:text-sm font-bold">+</span>
            </button>
          </div>

          {/* Total Price */}
          <p className="text-[12px] sm:text-lg font-black text-zinc-900 dark:text-gray-100">
            {formatCurrency(priceToUse * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
