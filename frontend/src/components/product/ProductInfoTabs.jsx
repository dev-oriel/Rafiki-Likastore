import React, { useState } from "react";

// 1. Accept 'product' as a prop
const ProductInfoTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-10 md:mt-24">
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav
          aria-label="Tabs"
          className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab("description")}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors ${
              activeTab === "description"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors ${
              activeTab === "reviews"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            Reviews
          </button>
        </nav>
      </div>

      <div className="py-6 sm:py-8">
        {/* Description Tab Content */}
        {activeTab === "description" && (
          // Added prose-sm for mobile, prose-base for larger screens
          <div className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert max-w-none">
            {/* 'whitespace-pre-line' respects line breaks from the textarea */}
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-zinc-900 dark:text-white">
              Customer Reviews
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-sm sm:text-base">
              No reviews yet.
            </p>
            {/* You would map over reviews here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfoTabs;
