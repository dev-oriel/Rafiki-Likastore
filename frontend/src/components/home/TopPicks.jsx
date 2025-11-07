import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products"); // Real API call
        setTopPicks(data.slice(0, 4)); // Takes the first 4
      } catch (err) {
        console.error("Failed to fetch top picks", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Top Picks for You
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {topPicks.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPicks;
