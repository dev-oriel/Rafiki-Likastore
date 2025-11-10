import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import ShopHeader from "../components/shop/ShopHeader";
import Sidebar from "../components/shop/Sidebar";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import { Loader } from "lucide-react";
import useDebounce from "../hooks/useDebounce";

const ShopPage = () => {
  // Product & Pagination State
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter Metadata State
  const [meta, setMeta] = useState({ categories: [], maxPrice: 5000 });
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  // Read 'type' from URL to match backend
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("type")?.split(",") || []
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("price[gte]")) || 0,
    Number(searchParams.get("price[lte]")) || meta.maxPrice,
  ]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 1. Fetch Filter Metadata on page load
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoadingMeta(true);
        const { data } = await api.get("/products/meta");
        setMeta(data);
        if (!searchParams.get("price[lte]")) {
          setPriceRange((prev) => [prev[0], data.maxPrice]);
        }
      } catch (err) {
        toast.error("Failed to load filters");
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, [searchParams]);

  // 2. Fetch Products whenever filters change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (debouncedSearchTerm) params.append("keyword", debouncedSearchTerm);

      // --- THIS IS THE FIX ---
      // Send 'type' to match the backend controller
      if (selectedTypes.length > 0)
        params.append("type", selectedTypes.join(","));
      // --- END OF FIX ---

      // Send price params (this logic is now correct)
      if (priceRange[0] > 0) params.append("price[gte]", priceRange[0]);
      // Only send lte if it's not the max (cleaner URL)
      if (priceRange[1] < meta.maxPrice)
        params.append("price[lte]", priceRange[1]);

      params.append("pageNumber", page);

      // Update URL bar
      const displayParams = new URLSearchParams();
      if (searchTerm) displayParams.set("keyword", searchTerm);
      if (selectedTypes.length > 0)
        displayParams.set("type", selectedTypes.join(",")); // Also update here
      if (priceRange[0] > 0) displayParams.set("price[gte]", priceRange[0]);
      if (priceRange[1] < meta.maxPrice)
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
    debouncedSearchTerm,
    selectedTypes,
    priceRange,
    setSearchParams,
    searchTerm,
    meta.maxPrice,
  ]);

  // Re-fetch when filters (or page) change
  useEffect(() => {
    fetchProducts();
    setMobileFiltersOpen(false); // Close mobile filter panel
  }, [fetchProducts]);

  // Handlers to reset page to 1 on filter change
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    setPage(1);
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setPage(1);
  };

  return (
    <>
      <ShopHeader
        onSearch={handleSearch}
        initialTerm={searchTerm}
        productCount={count}
        onOpenFilters={() => setMobileFiltersOpen(true)}
      />
      <main className="px-4 sm:px-6 lg:px-8 flex justify-center py-10">
        <div className="flex w-full max-w-7xl gap-8">
          <Sidebar
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            categories={meta.categories} // Pass dynamic categories
            maxPrice={meta.maxPrice} // Pass dynamic max price
            loading={loadingMeta} // Pass loading state
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
