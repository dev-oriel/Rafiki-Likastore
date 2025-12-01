import React from "react";

const Pagination = ({ page, pages, setPage }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center gap-1 sm:gap-2 p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-x-auto max-w-full">
        {/* Previous Button */}
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex size-8 sm:size-10 shrink-0 items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">
            chevron_left
          </span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {[...Array(pages).keys()].map((x) => (
            <button
              key={x + 1}
              onClick={() => setPage(x + 1)}
              className={`text-xs sm:text-sm font-bold flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-full transition-all ${
                page === x + 1
                  ? "text-white bg-amber-500 shadow-md shadow-amber-500/20 scale-105"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {x + 1}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          disabled={page === pages}
          className="flex size-8 sm:size-10 shrink-0 items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
