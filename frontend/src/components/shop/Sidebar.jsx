import React from "react";

const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      {/* Adjust top to match the sticky header's height + extra space */}
      <div className="sticky top-40 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Price Range</h3>
          <div className="relative h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full">
            <div
              className="absolute h-1 bg-amber-500 rounded-full"
              style={{ left: "10%", width: "60%" }}
            ></div>
            <div
              className="absolute -top-1.5 w-4 h-4 bg-amber-500 rounded-full cursor-pointer"
              style={{ left: "10%" }}
            ></div>
            <div
              className="absolute -top-1.5 w-4 h-4 bg-amber-500 rounded-full cursor-pointer"
              style={{ left: "70%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>$10</span>
            <span>$150</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Type</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                type="checkbox"
              />
              <span className="text-base">Whiskey</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                defaultChecked
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent dark:checked:bg-amber-500"
                type="checkbox"
              />
              <span className="text-base">Vodka</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                type="checkbox"
              />
              <span className="text-base">Gin</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                type="checkbox"
              />
              <span className="text-base">Rum</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                className="h-5 w-5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500 bg-transparent dark:bg-transparent"
                type="checkbox"
              />
              <span className="text-base">Tequila</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
