import React from "react";

const ShopProductCard = ({ product }) => {
  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-lg bg-white dark:bg-zinc-900/50 p-4 transition-shadow hover:shadow-xl dark:hover:shadow-amber-500/10">
      <div
        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-contain rounded-xl"
        alt={product.name}
        style={{ backgroundImage: `url("${product.image}")` }}
      ></div>
      <div>
        <p className="text-base font-bold leading-normal">{product.name}</p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-normal">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-normal flex items-center gap-1">
          {product.rating}
          <span className="material-symbols-outlined text-amber-500 text-base">
            star
          </span>
        </p>
      </div>
      <button className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-full bg-amber-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
};

export default ShopProductCard;
