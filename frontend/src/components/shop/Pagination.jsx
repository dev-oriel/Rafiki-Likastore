import React from "react";

const Pagination = ({ page, pages, setPage }) => {
  if (pages <= 1) return null; // Don't show pagination if there's only one page

  return (
    <div className="flex items-center justify-center p-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      {/* Page Numbers */}
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => setPage(x + 1)}
          className={`text-sm font-medium leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${
            page === x + 1
              ? "text-white dark:text-zinc-950 bg-amber-500"
              : "hover:bg-zinc-900/5 dark:hover:bg-white/5"
          }`}
        >
          {x + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage((p) => Math.min(pages, p + 1))}
        disabled={page === pages}
        className="flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-xl">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
