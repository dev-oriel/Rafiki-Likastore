import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatCurrency"; // Import KES formatter
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// This is the inner card component
const FavoriteItem = ({ product, onRemove }) => {
  const navigate = useNavigate();

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  const priceToDisplay =
    product.isOnSale && product.discountedPrice > 0
      ? product.discountedPrice
      : product.price;

  return (
    <div className="min-w-[220px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm flex flex-col items-center p-4 relative hover:shadow-md transition-all">
      <Link
        to={`/product/${product._id}`}
        className="cursor-pointer w-full flex flex-col items-center"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-28 h-28 rounded-lg object-contain mb-3"
        />
        <p className="font-semibold text-zinc-900 dark:text-white text-center">
          {product.name}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
          {formatCurrency(priceToDisplay)}
        </p>
      </Link>
      <button
        className="absolute top-3 right-3 text-red-600 hover:text-red-700 transition"
        aria-label="remove favorite"
        onClick={onRemove}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
};

// This is the main component for the profile page
const FavoritesCard = () => {
  const { user, toggleFavorite } = useAuth();
  const favorites = user?.favorites || [];

  const handleRemoveFavorite = (productId) => {
    toggleFavorite(productId);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="favorites"
    >
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
        My Favorites
      </h3>

      {favorites.length > 0 ? (
        <div className="flex overflow-x-auto space-x-4 pb-3 -mb-3">
          {favorites.map((product) => (
            <FavoriteItem
              key={product._id}
              product={product}
              onRemove={() => handleRemoveFavorite(product._id)}
              // Pass props explicitly for the FavoriteItem
              img={product.image}
              title={product.name}
              subtitle={formatCurrency(product.price)}
              link={`/product/${product._id}`}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-6">
          You haven’t added any favorites yet. Click the heart icon on a product
          to save it here.
        </p>
      )}
    </div>
  );
};

export default FavoritesCard;
