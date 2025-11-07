import React from "react";
import { Link } from "react-router-dom";

const Pagination = () => {
  return (
    <div className="flex items-center justify-center p-4 mt-8">
      <Link
        to="#"
        className="flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </Link>
      <Link
        to="#"
        className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white dark:text-zinc-950 rounded-full bg-amber-500"
      >
        1
      </Link>
      <Link
        to="#"
        className="text-sm font-normal leading-normal flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        2
      </Link>
      <Link
        to="#"
        className="text-sm font-normal leading-normal flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        3
      </Link>
      <span className="text-sm font-normal leading-normal flex size-10 items-center justify-center">
        ...
      </span>
      <Link
        to="#"
        className="text-sm font-normal leading-normal flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        10
      </Link>
      <Link
        to="#"
        className="flex size-10 items-center justify-center hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined text-xl">chevron_right</span>
      </Link>
    </div>
  );
};

export default Pagination;
