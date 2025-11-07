import React from "react";
import ShopHeader from "../components/shop/ShopHeader";
import Sidebar from "../components/shop/Sidebar";
import ShopProductGrid from "../components/shop/ShopProductGrid";

const ShopPage = () => {
  return (
    <>
      {/* Sticky Header with Filters */}
      <ShopHeader />

      {/* Main Content */}
      <main className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex justify-center py-10">
        <div className="flex w-full max-w-1280px flex-1 gap-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Product Grid + Pagination */}
          <ShopProductGrid />
        </div>
      </main>
    </>
  );
};

export default ShopPage;
