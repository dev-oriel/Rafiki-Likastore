import React from "react";
import { Link } from "react-router-dom";

const FavoriteCard = ({ product }) => {
  return (
    <div className="flex flex-col gap-3 min-w-48">
      <Link
        to={`/product/${product.slug}`}
        className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-zinc-800 aspect-[3/4]"
      >
        {" "}
        {/* Updated color */}
        <img
          className="h-full w-full object-contain object-center p-3"
          alt={product.name}
          src={product.image}
        />
        {product.deal && (
          <div className="absolute top-2 left-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-500">
            {" "}
            {/* Updated color */}
            {product.deal}
          </div>
        )}
      </Link>
      <div>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          ${product.price.toFixed(2)}
        </p>{" "}
        {/* Updated color */}
      </div>
    </div>
  );
};

export default FavoriteCard;
