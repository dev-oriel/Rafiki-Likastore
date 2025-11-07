import React from "react";

const ShopHeader = ({ onSearch, initialTerm, productCount }) => {
  // We remove the local state and form, it's all handled by the parent
  return (
    <header className="sticky top-[80px] z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b dark:border-zinc-800">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="mx-auto flex max-w-[1280px] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Shop All Liquor
            </h1>
            <span className="text-zinc-500 dark:text-zinc-400">
              {productCount} {productCount === 1 ? "product" : "products"} found
            </span>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            {/* Removed the non-functional buttons */}
            <div className="relative">
              <input
                type="text"
                value={initialTerm} // Controlled by parent
                onChange={(e) => onSearch(e.target.value)} // Search as you type
                placeholder="Search liquor..."
                className="h-10 rounded-full bg-zinc-900/5 dark:bg-white/5 px-4 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
