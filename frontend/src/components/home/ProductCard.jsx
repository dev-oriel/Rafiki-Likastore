import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

// 1. Get the base URL
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // 2. Check if image is an external link or a local path
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${API_BASE_URL}${product.image}`;

  return (
    <div className="flex flex-col gap-3 rounded-lg p-2 transition-shadow hover:shadow-md dark:hover:bg-zinc-800">
      <Link
        to={`/product/${product._id}`}
        className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 aspect-[3/4]"
      >
        <img
          className="h-full w-full object-contain object-center p-4"
          alt={product.name}
          src={imageUrl} // 3. Use the corrected URL
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white transition-transform hover:scale-110"
          title="Add to cart"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            add
          </span>
        </button>
      </Link>
      <div>
        <h3 className="font-medium leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          <p>${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-amber-500"
              style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>{product.rating || 4.5}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
