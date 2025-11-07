import React, { useState, useEffect } from "react";
import FavoriteCard from "./FavoriteCard";
import api from "../../services/api"; // Fetches from your backend

const StudentFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products"); // Real API call
        setFavorites(data.slice(4, 9)); // Takes 5 different products
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
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4">
          <div className="flex items-stretch px-4 gap-6">
            {favorites.map((product) => (
              <FavoriteCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentFavorites;
