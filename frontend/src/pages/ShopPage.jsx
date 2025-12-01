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

  // FIX: Changed 'type' to 'category' to match the backend expectations
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category")?.split(",") || []
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
        // Only set default max price if not already in URL
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

      // --- FIX: Sending 'category' instead of 'type' ---
      if (selectedCategories.length > 0)
        params.append("category", selectedCategories.join(","));

      // Send price params
      if (priceRange[0] > 0) params.append("price[gte]", priceRange[0]);
      if (priceRange[1] < meta.maxPrice)
        params.append("price[lte]", priceRange[1]);

      params.append("pageNumber", page);

      // Update URL bar
      const displayParams = new URLSearchParams();
      if (searchTerm) displayParams.set("keyword", searchTerm);

      // FIX: Update URL to say 'category'
      if (selectedCategories.length > 0)
        displayParams.set("category", selectedCategories.join(","));

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
    selectedCategories, // Updated dependency
    priceRange,
    setSearchParams,
    searchTerm,
    meta.maxPrice,
  ]);

  // Re-fetch when filters (or page) change
  useEffect(() => {
    fetchProducts();
    setMobileFiltersOpen(false);
  }, [fetchProducts]);

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
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

      <main className="px-4 sm:px-6 lg:px-8 flex justify-center py-6 sm:py-10">
        <div className="flex w-full max-w-7xl gap-8">
          <Sidebar
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            // Passing updated props
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            categories={meta.categories}
            maxPrice={meta.maxPrice}
            loading={loadingMeta}
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
