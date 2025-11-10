import React, { useState, useEffect } from "react";
import RelatedProductCard from "./RelatedProductCard";
import api from "../../services/api"; // Import api
import { Loader } from "lucide-react"; // Import Loader

// 1. Accept category and currentProductId as props
const RelatedProducts = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch products when the category prop is available
  useEffect(() => {
    if (!category) return; // Don't fetch if no category

    const fetchRelated = async () => {
      try {
        setLoading(true);
        // 3. Fetch products by the same category
        const { data } = await api.get(`/products?category=${category}`);

        // 4. Filter out the product we are already looking at
        const relatedProducts = data.products
          .filter((product) => product._id !== currentProductId)
          .slice(0, 4); // Take the first 4

        setRelated(relatedProducts);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [category, currentProductId]); // Re-fetch if these change

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          You Might Also Like
        </h2>
        <div className="flex justify-center py-10">
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  // 5. Don't show the section if no related products are found
  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        You Might Also Like
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {related.map((product) => (
          <RelatedProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
