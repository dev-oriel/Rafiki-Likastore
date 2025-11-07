import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { Link } from "react-router-dom";

const StudentFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products"); // data is { products: [...] }

        // --- THIS IS THE FIX ---
        // We must get the array from the 'products' property
        setFavorites(data.products.slice(4, 8));
        // --- END OF FIX ---
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Student Favorites
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-right">
          <Link
            to="/shop"
            className="text-sm font-medium text-amber-600 hover:text-amber-500 hover:underline"
          >
            View more &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StudentFavorites;
