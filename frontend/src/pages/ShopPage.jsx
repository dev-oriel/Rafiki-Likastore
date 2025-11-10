import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ShopHeader from "../components/shop/ShopHeader";
import Sidebar from "../components/shop/Sidebar";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import { Loader } from "lucide-react";
import useDebounce from "../hooks/useDebounce";

const MAX_PRICE = 5000; // 1. Set max price to 5,000 KES

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    Number(searchParams.get("price[lte]")) || MAX_PRICE, // 2. Use new max price
  ]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // This is the function that fetches data
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (debouncedSearchTerm) params.append("keyword", debouncedSearchTerm);
      if (selectedTypes.length > 0)
        params.append("type", selectedTypes.join(","));

      // --- THIS IS THE PRICE FILTER FIX ---
      // Always send both min and max price
      params.append("price[gte]", priceRange[0]);
      params.append("price[lte]", priceRange[1]);
      // --- END OF FIX ---

      params.append("pageNumber", page);

      // Update URL bar (we use the instant search term here so the URL updates as you type)
      const displayParams = new URLSearchParams();
      if (searchTerm) displayParams.set("keyword", searchTerm);
      if (selectedTypes.length > 0)
        displayParams.set("type", selectedTypes.join(","));
      if (priceRange[0] > 0) displayParams.set("price[gte]", priceRange[0]);
      if (priceRange[1] < MAX_PRICE)
        displayParams.set("price[lte]", priceRange[1]);
      if (page > 1) displayParams.set("pageNumber", page);
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
    debouncedSearchTerm, // API call uses debounced term
    selectedTypes,
    priceRange,
    setSearchParams,
    searchTerm, // URL uses instant term
  ]);

  // Re-fetch when filters change
  useEffect(() => {
    fetchProducts();
    setMobileFiltersOpen(false); // Close mobile filter panel on change
  }, [fetchProducts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page
  };

  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    setPage(1); // Reset to first page
  };

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
        onOpenFilters={() => setMobileFiltersOpen(true)}
      />
      {/* 3. Updated padding */}
      <main className="px-4 sm:px-6 lg:px-8 flex justify-center py-10">
        <div className="flex w-full max-w-7xl gap-8">
          <Sidebar
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            mobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
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
