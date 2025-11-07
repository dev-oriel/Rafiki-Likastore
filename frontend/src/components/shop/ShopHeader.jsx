import React from "react";

const ShopHeader = () => {
  return (
    // Sticks to the top, just below the main navbar (z-10 is below navbar's z-50)
    // Assumes main navbar is ~65px-80px tall. top-16 (64px) or top-20 (80px) are good starts.
    <header className="sticky top-[69px] z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
        <div className="mx-auto flex max-w-[1280px] flex-col">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Shop All Liquor
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 pt-4">
            <div className="flex flex-wrap gap-2">
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full border-2 border-amber-500 bg-amber-500/20 px-4">
                <p className="text-sm font-medium leading-normal text-amber-500">
                  Category
                </p>
                <span className="material-symbols-outlined text-amber-500 text-xl">
                  expand_more
                </span>
              </button>
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-zinc-900/5 dark:bg-white/5 px-4 hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium leading-normal">Price</p>
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-zinc-900/5 dark:bg-white/5 px-4 hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium leading-normal">Type</p>
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-zinc-900/5 dark:bg-white/5 px-4 hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors">
                <p className="text-sm font-medium leading-normal">Origin</p>
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>
            </div>
            <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-900/5 dark:bg-white/5 hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
