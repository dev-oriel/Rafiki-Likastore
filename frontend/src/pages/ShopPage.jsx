import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ShopHeader from "../components/shop/ShopHeader";
import Sidebar from "../components/shop/Sidebar";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import { Loader } from "lucide-react";
import useDebounce from "../hooks/useDebounce"; // 1. Import the debounce hook

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get filter state from URL search params
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("type")?.split(",") || []
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("price[gte]")) || 0,
    Number(searchParams.get("price[lte]")) || 50000,
  ]);

  // 2. Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 3. This function fetches data based on current state
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Use the debounced search term for the API call
      if (debouncedSearchTerm) params.append("keyword", debouncedSearchTerm);
      if (selectedTypes.length > 0)
        params.append("type", selectedTypes.join(","));
      if (priceRange[0] > 0) params.append("price[gte]", priceRange[0]);
      if (priceRange[1] < 50000) params.append("price[lte]", priceRange[1]);
      params.append("pageNumber", page);

      // Update URL with the *instant* search term for display
      const displayParams = new URLSearchParams(params);
      if (searchTerm) displayParams.set("keyword", searchTerm);
      else displayParams.delete("keyword");
      setSearchParams(displayParams, { replace: true });

      // Fetch from backend
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);
      setCount(data.count);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearchTerm,
    selectedTypes,
    priceRange,
    setSearchParams,
    searchTerm,
  ]); // 4. Add dependencies

  // 5. Re-fetch whenever a debounced value or filter changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler for search (updates instantly)
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page
  };

  // Handler for type filter
  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    setPage(1); // Reset to first page
  };

  // Handler for price filter
  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setPage(1); // Reset to first page
  };

  return (
    <>
      <ShopHeader
        onSearch={handleSearch}
        initialTerm={searchTerm}
        productCount={count}
      />
      <main className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex justify-center py-10">
        <div className="flex w-full max-w-[1280px] flex-1 gap-8">
          <Sidebar
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
          />
          {loading && products.length === 0 ? (
            <div className="flex-1 flex justify-center items-start pt-20">
              <Loader className="size-12 animate-spin text-amber-500" />
            </div>
          ) : (
            <ShopProductGrid
              products={products}
              page={page}
              pages={pages}
              setPage={setPage}
              loading={loading}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default ShopPage;
