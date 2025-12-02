import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const FavoriteItem = ({ product, onRemove }) => {
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  const priceToDisplay =
    product.isOnSale && product.discountedPrice > 0
      ? product.discountedPrice
      : product.price;

  return (
    <div className="min-w-[160px] sm:min-w-[200px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm flex flex-col items-center p-3 sm:p-4 relative hover:shadow-md transition-all snap-center">
      <Link
        to={`/product/${product._id}`}
        className="cursor-pointer w-full flex flex-col items-center"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg object-contain mb-3"
        />
        <p className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white text-center line-clamp-2 leading-tight">
          {product.name}
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 text-center mt-1">
          {formatCurrency(priceToDisplay)}
        </p>
      </Link>
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition bg-white/80 dark:bg-black/20 rounded-full p-1"
        aria-label="remove favorite"
        onClick={onRemove}
      >
        <span
          className="material-symbols-outlined text-lg sm:text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
};

const FavoritesCard = () => {
  const { user, toggleFavorite } = useAuth();
  const favorites = user?.favorites || [];

  const handleRemoveFavorite = (productId) => {
    toggleFavorite(productId);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
      id="favorites"
    >
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-4">
        My Favorites
      </h3>

      {favorites.length > 0 ? (
        // Horizontal scroll container with snap scrolling
        <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 -mb-2 custom-scrollbar snap-x snap-mandatory">
          {favorites.map((product) => (
            <FavoriteItem
              key={product._id}
              product={product}
              onRemove={() => handleRemoveFavorite(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-lg">
          <span className="material-symbols-outlined text-3xl text-zinc-300 mb-2">
            favorite_border
          </span>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            No favorites saved yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesCard;
