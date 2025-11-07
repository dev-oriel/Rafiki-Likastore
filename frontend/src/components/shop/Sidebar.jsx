import React from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import { formatCurrency } from "../../utils/formatCurrency";
import { CATEGORIES } from "../../constants/categories"; // 1. Import your new categories

const Sidebar = ({
  priceRange,
  onPriceChange,
  selectedTypes,
  onTypeChange,
}) => {
  const MIN_PRICE = 0;
  const MAX_PRICE = 50000; // Set a max price in KES

  return (
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
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Category</h3>
          <div className="space-y-3">
            {/* 2. Map over the new CATEGORIES list */}
            {CATEGORIES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => onTypeChange(type)}
                  className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                />
                <span className="text-base">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
