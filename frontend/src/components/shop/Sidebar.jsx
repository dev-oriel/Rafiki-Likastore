import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { formatCurrency } from "../../utils/formatCurrency";

const SidebarContent = ({
  priceRange,
  onPriceChange,
  selectedCategories, 
  onCategoryChange, 
  categories,
  maxPrice,
  loading,
}) => (
  <div className="flex flex-col gap-8 pb-10">
    {/* Price Filter */}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500 text-lg">
          payments
        </span>
        Price Range
      </h3>
      {loading ? (
        <div className="h-10 text-sm text-zinc-500 animate-pulse">
          Loading prices...
        </div>
      ) : (
        <div className="px-1">
          <PriceRangeSlider
            min={0}
            max={maxPrice}
            initialValues={priceRange}
            onPriceChange={onPriceChange}
          />
          <div className="mt-4 flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {formatCurrency(priceRange[0])}
            </span>
            <span className="text-zinc-300">–</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              {formatCurrency(priceRange[1])}
            </span>
          </div>
        </div>
      )}
    </div>

    {/* Category Filter */}
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500 text-lg">
          category
        </span>
        Categories
      </h3>
      <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-sm text-zinc-500 animate-pulse">
            Loading categories...
          </div>
        ) : (
          categories.map((category) => (
            <label
              key={category}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all border ${
                selectedCategories.includes(category)
                  ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                  : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-zinc-700"
              }`}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                  className="peer h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent"
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  selectedCategories.includes(category)
                    ? "text-amber-900 dark:text-amber-100"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {category}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  </div>
);

const Sidebar = ({
  priceRange,
  onPriceChange,
  selectedCategories, // Updated prop name
  onCategoryChange, // Updated prop name
  categories = [],
  maxPrice = 5000,
  loading = false,
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-40 max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 custom-scrollbar">
          <SidebarContent
            priceRange={priceRange}
            onPriceChange={onPriceChange}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            categories={categories}
            maxPrice={maxPrice}
            loading={loading}
          />
        </div>
      </aside>

      {/* Mobile sliding panel */}
      <div
        className={`fixed inset-0 z-60 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
          aria-hidden="true"
        />

        <div
          className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl transform transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xl font-black tracking-tight">Filters</h3>
            <button
              onClick={onCloseMobile}
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <SidebarContent
              priceRange={priceRange}
              onPriceChange={onPriceChange}
              selectedCategories={selectedCategories}
              onCategoryChange={onCategoryChange}
              categories={categories}
              maxPrice={maxPrice}
              loading={loading}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={onCloseMobile}
              className="w-full py-3 rounded-full bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
