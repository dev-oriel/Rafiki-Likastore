import React, { useState } from "react";

const ProductInfoTabs = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16 md:mt-24">
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${
              activeTab === "description"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base ${
              activeTab === "reviews"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            Reviews
          </button>
        </nav>
      </div>

      <div className="py-8">
        {/* Description Tab Content */}
        {activeTab === "description" && (
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
              Product Story
            </h3>
            <p>
              For a smooth and refreshing tasting drink, Captain Morgan Original
              Spiced Gold is best served in a tankard over ice, with cola. The
              perfect serve is 25ml of Captain Morgan Original Spiced Gold,
              100ml of cola and a slice of lime. Smooth and medium bodied, this
              spiced rum is a secret blend of Caribbean rums and mellow spice
              and other natural flavours. It gets its distinct richness and
              amber colour from aging in charred white oak barrels. Captain
              Morgan Original Spiced Gold is the perfect spirit for legendary
              times with your favourite crewmates.
            </p>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
              Tasting Notes
            </h3>
            <ul>
              <li>
                <strong>Nose:</strong> Rich natural vanilla, brown sugar, dried
                fruit, warming spices with hints of oak.
              </li>
              <li>
                <strong>Palate:</strong> A perfectly balanced spirit with a
                smooth finish.
              </li>
              <li>
                <strong>Finish:</strong> Comes together in an experience that is
                smooth and refreshing.
              </li>
            </ul>
          </div>
        )}
        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <div>
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
              Customer Reviews
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
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
