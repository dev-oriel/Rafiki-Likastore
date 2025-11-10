import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { formatCurrency } from "../../utils/formatCurrency";
import { CATEGORIES } from "../../constants/categories";

const Sidebar = ({
  priceRange,
  onPriceChange,
  selectedTypes,
  onTypeChange,
  mobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 5000; // 1. Set max price to 5,000 KES

  return (
    <>
      {/* Desktop sidebar */}
      {/* 2. Made sidebar narrower for more grid space */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-40 flex flex-col gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Price Range (KES)</h3>
            <PriceRangeSlider
              min={MIN_PRICE}
              max={MAX_PRICE}
              initialValues={priceRange}
              onPriceChange={onPriceChange}
            />
            <div className="mt-2 text-sm text-zinc-500">
              {formatCurrency(priceRange[0])} — {formatCurrency(priceRange[1])}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((type) => (
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
              ))}
            </div>
          </div>
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

          <div className="mb-6">
            <h4 className="font-medium mb-2">Price (KES)</h4>
            <PriceRangeSlider
              min={MIN_PRICE}
              max={MAX_PRICE}
              initialValues={priceRange}
              onPriceChange={onPriceChange}
            />
            <div className="mt-2 text-sm text-zinc-500">
              {formatCurrency(priceRange[0])} — {formatCurrency(priceRange[1])}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-zinc-50 dark:bg-zinc-800"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => onTypeChange(type)}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
