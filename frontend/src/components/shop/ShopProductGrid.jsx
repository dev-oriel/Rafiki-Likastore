import React from "react";
import ShopProductCard from "./ShopProductCard";
import Pagination from "./Pagination";
import { Loader } from "lucide-react";

const ShopProductGrid = ({ products, page, pages, setPage, loading }) => {
  return (
    <div className="flex-1 relative min-h-[500px]">
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 flex justify-center items-start pt-20 z-10 backdrop-blur-[2px] rounded-2xl">
          <Loader className="size-12 animate-spin text-amber-500" />
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-zinc-300 mb-4">
            search_off
          </span>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            No products found.
          </p>
          <p className="text-zinc-500 mt-2">
            Try adjusting your price range or categories.
          </p>
        </div>
      ) : (
        <>
          {/* Responsive Grid:
            - grid-cols-2 on mobile (Compact, standard e-commerce look)
            - md:grid-cols-3
            - lg:grid-cols-4 
            - gap-3 on mobile (tight), gap-6 on desktop
          */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ShopProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 mb-8">
            <Pagination page={page} pages={pages} setPage={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default ShopProductGrid;
