import React from "react";
import ShopProductCard from "./ShopProductCard";
import Pagination from "./Pagination";
import { Loader } from "lucide-react";

const ShopProductGrid = ({ products, page, pages, setPage, loading }) => {
  return (
    <div className="flex-1 relative">
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
          {/* 1 column mobile, 2 on small, 3 on md, 4 on lg+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ShopProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination page={page} pages={pages} setPage={setPage} />
          </div>
        </>
      )}
    </div>
  );
};

export default ShopProductGrid;
