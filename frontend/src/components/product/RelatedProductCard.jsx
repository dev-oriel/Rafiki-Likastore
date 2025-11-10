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
    <div className="relative group">
      <div className="relative w-full h-72 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center p-4">
        {/* --- THIS IS THE FIX --- */}
        {/* The w-full and h-full classes are now on the Link tag */}
        <Link to={`/product/${product._id}`} className="w-full h-full">
          <div
            className="w-full h-full bg-contain bg-no-repeat bg-center group-hover:scale-105 transition-transform duration-300"
            alt={product.name}
            style={{ backgroundImage: `url("${imageUrl}")` }}
          ></div>
        </Link>
        {/* --- END OF FIX --- */}

        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
          title="Add to cart"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            add
          </span>
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-zinc-700 dark:text-zinc-200">
            <Link className="font-bold" to={`/product/${product._id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {product.category}
          </p>
        </div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
};

export default RelatedProductCard;
