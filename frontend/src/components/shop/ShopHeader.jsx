import React from "react";

const ShopHeader = ({ onSearch, initialTerm, productCount, onOpenFilters }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(initialTerm);
  };

  return (
    <header className="sticky top-[64px] sm:top-[80px] z-20 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
      <div className="px-4 sm:px-8 md:px-12 lg:px-8 xl:px-8 py-4 sm:py-5 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            {/* Scaled down heading for mobile: text-2xl -> text-4xl */}
            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white">
              Shop All Liquor
            </h1>
            <span className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
              {productCount} {productCount === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit} className="relative flex-1 group">
              <input
                type="text"
                value={initialTerm}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search liquor..."
                className="w-full h-10 sm:h-11 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-4 pl-11 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-amber-500 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
              </div>
            </form>

            {/* Mobile Filter Button */}
            <button
              onClick={onOpenFilters}
              className="lg:hidden inline-flex items-center gap-2 h-10 sm:h-11 rounded-full bg-zinc-900 dark:bg-zinc-800 px-4 text-sm font-bold text-white shadow-sm hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              <span className="hidden xs:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
