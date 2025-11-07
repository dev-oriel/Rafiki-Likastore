import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // 1. Import useCart
import toast from "react-hot-toast"; // 2. Import toast

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // 3. Get the addToCart function

  // 4. Create the click handler
  const handleAddToCart = (e) => {
    e.preventDefault(); // This stops the Link from navigating
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg p-2 transition-shadow hover:shadow-md dark:hover:bg-zinc-800">
      <Link
        to={`/product/${product._id}`}
        className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 aspect-[3/4]"
      >
        <img
          className="h-full w-full object-contain object-center p-4"
          alt={product.name}
          src={product.image}
        />
        <button
          onClick={handleAddToCart} // 5. Attach the handler
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
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
