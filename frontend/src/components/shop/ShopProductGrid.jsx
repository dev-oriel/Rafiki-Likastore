import React from "react";
import ShopProductCard from "./ShopProductCard";
import Pagination from "./Pagination";
import { Loader } from "lucide-react";

const ShopProductGrid = ({ products, page, pages, setPage, loading }) => {
  return (
    <div className="flex-1 relative">
      {/* Loading overlay for subsequent fetches */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 flex justify-center items-start pt-20 z-10">
          <Loader className="size-12 animate-spin text-amber-500" />
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl font-medium text-zinc-500 dark:text-zinc-400">
            No products found.
          </p>
          <p className="text-zinc-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ShopProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* --- THIS IS THE FIX --- */}
          {/* This renders the pagination at the bottom of the grid */}
          <Pagination page={page} pages={pages} setPage={setPage} />
        </>
      )}
    </div>
  );
};

export default ShopProductGrid;
