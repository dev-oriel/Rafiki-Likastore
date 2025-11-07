import React from "react";
import { Link } from "react-router-dom";

// 1. Get the base URL
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const FavoriteCard = ({ product }) => {
  // 2. Check if image is an external link or a local path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  return (
    <div className="flex flex-col gap-3 min-w-48">
      <Link
        to={`/product/${product._id}`}
        className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 aspect-[3/4]"
      >
        <img
          className="h-full w-full object-contain object-center p-3"
          alt={product.name}
          src={imageUrl} // 3. Use the corrected URL
        />
        {product.deal && (
          <div className="absolute top-2 left-2 rounded-full bg-amber-600/20 px-2 py-0.5 text-xs font-bold text-amber-600">
            {product.deal}
          </div>
        )}
      </Link>
      <div>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default FavoriteCard;
