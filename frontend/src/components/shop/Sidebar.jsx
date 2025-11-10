import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { formatCurrency } from "../../utils/formatCurrency";
// 1. Remove CATEGORIES import, as we get it from props

const SidebarContent = ({
  priceRange,
  onPriceChange,
  selectedTypes,
  onTypeChange,
  categories,
  maxPrice,
  loading,
}) => (
  <div className="flex flex-col gap-8">
    <div>
      <h3 className="text-lg font-bold mb-4">Price Range (KES)</h3>
      {loading ? (
        <div className="h-10 text-sm text-zinc-500">Loading...</div>
      ) : (
        <>
          <PriceRangeSlider
            min={0}
            max={maxPrice} // 2. Use dynamic max price
            initialValues={priceRange}
            onPriceChange={onPriceChange}
          />
          <div className="mt-2 text-sm text-zinc-500">
            {formatCurrency(priceRange[0])} — {formatCurrency(priceRange[1])}
          </div>
        </>
      )}
    </div>

    <div>
      <h3 className="text-lg font-bold mb-4">Category</h3>
      <div className="grid grid-cols-2 gap-2">
        {loading ? (
          <div className="text-sm text-zinc-500">Loading...</div>
        ) : (
          // 3. Map over categories from props
          categories.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer bg-white/50 dark:bg-zinc-900/40 p-2 rounded-md"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeChange(type)}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
              />
              <span className="text-sm">{type}</span>
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
  selectedTypes,
  onTypeChange,
  categories = [], // Default to empty array
  maxPrice = 5000, // Default max price
  loading = false,
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-40">
          <SidebarContent
            priceRange={priceRange}
            onPriceChange={onPriceChange}
            selectedTypes={selectedTypes}
            onTypeChange={onTypeChange}
            categories={categories}
            maxPrice={maxPrice}
            loading={loading}
          />
        </div>
      </aside>

      {/* Mobile sliding panel */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Filters</h3>
            <button
              onClick={onCloseMobile}
              className="rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <SidebarContent
            priceRange={priceRange}
            onPriceChange={onPriceChange}
            selectedTypes={selectedTypes}
            onTypeChange={onTypeChange}
            categories={categories}
            maxPrice={maxPrice}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
