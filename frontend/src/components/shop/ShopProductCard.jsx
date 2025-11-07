import React from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// 1. Get the base URL
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const ShopProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // 2. Check if image is an external link or a local path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-lg bg-white dark:bg-zinc-900/50 p-4 transition-shadow hover:shadow-xl dark:hover:shadow-amber-500/10">
      <Link to={`/product/${product._id}`}>
        <div
          className="w-full bg-center bg-no-repeat aspect-[3/4] bg-contain rounded-xl"
          alt={product.name}
          style={{ backgroundImage: `url("${imageUrl}")` }} // 3. Use the corrected URL
        ></div>
      </Link>
      <div>
        <Link to={`/product/${product._id}`} className="hover:underline">
          <p className="text-base font-bold leading-normal">{product.name}</p>
        </Link>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-normal">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-normal flex items-center gap-1">
          {product.rating || 4.5}
          <span className="material-symbols-outlined text-amber-500 text-base">
            star
          </span>
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-full bg-amber-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        title="Add to cart"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
};

export default ShopProductCard;
