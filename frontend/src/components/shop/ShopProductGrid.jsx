import React, { useState, useEffect } from "react";
import ShopProductCard from "./ShopProductCard";
import Pagination from "./Pagination";
import api from "../../services/api";
import { Loader } from "lucide-react";

const ShopProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products"); // Real API call
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ShopProductCard key={product._id} product={product} />
        ))}
      </div>

      <Pagination />
    </div>
  );
};

export default ShopProductGrid;
