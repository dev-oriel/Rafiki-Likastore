import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency"; // 1. Import KES formatter

// 2. Get the base URL
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // 3. Fix image path
  const imageUrl = item.image.startsWith("http")
    ? item.image
    : `${API_BASE_URL}${item.image}`;

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <Link to={`/product/${item._id}`}>
        {/* 4. Replaced <div> with <img> for consistency */}
        <img
          src={imageUrl}
          alt={item.name}
          className="size-20 rounded-lg object-contain bg-zinc-50 dark:bg-zinc-800"
        />
      </Link>

      <div className="flex-grow">
        <Link to={`/product/${item._id}`} className="hover:underline">
          <p className="text-zinc-900 dark:text-gray-200 text-base font-bold leading-normal line-clamp-1">
            {item.name}
          </p>
        </Link>
        {/* 5. Use KES formatter */}
        <p className="text-zinc-500 dark:text-gray-400 text-sm font-normal leading-normal">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Quantity Adjuster */}
      <div className="shrink-0">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-gray-200">
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
            className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
          >
            -
          </button>
          <span className="text-base font-medium w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Total Price */}
      <p className="text-base font-bold w-20 text-right text-zinc-900 dark:text-gray-200 hidden sm:block">
        {/* 6. Use KES formatter */}
        {formatCurrency(item.price * item.quantity)}
      </p>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-zinc-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        title="Remove item"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};

export default CartItem;
