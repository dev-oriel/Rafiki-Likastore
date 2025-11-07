import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import RelatedProducts from "../components/product/RelatedProducts";
import ProductInfoTabs from "../components/product/ProductInfoTabs";
import { Loader } from "lucide-react"; // Import Loader

// (Breadcrumbs component)
const Breadcrumbs = ({ category, name }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    <Link
      className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-sm font-medium"
      to="/"
    >
      Home
    </Link>
    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
      /
    </span>
    <Link
      className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-sm font-medium"
      to="/shop"
    >
      Shop
    </Link>
    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
      /
    </span>
    <span className="text-zinc-900 dark:text-white text-sm font-medium">
      {name}
    </span>
  </div>
);

// (Helper to get the server URL for images)
const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// (ProductImage component)
const ProductImage = ({ image, name }) => (
  <div className="w-full aspect-[3/4] rounded-lg bg-white dark:bg-zinc-900/50 p-6 flex items-center justify-center relative group">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-amber-500/20 blur-3xl rounded-full"></div>
    <div
      className="w-full h-full bg-center bg-no-repeat bg-contain transition-transform duration-300 group-hover:scale-110 z-10"
      alt={name}
      style={{
        backgroundImage: `url("${
          image.startsWith("http") ? image : API_BASE_URL + image
        }")`,
      }}
    ></div>
  </div>
);

// (ProductDetails component)
const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">
          {product.category}
        </p>
        <h1 className="text-zinc-900 dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* (Rating logic) */}
        <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
          4.5 (128 Reviews)
        </span>
      </div>

      <p className="text-zinc-900 dark:text-white text-5xl font-extrabold">
        ${product.price.toFixed(2)}
      </p>

      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-prose">
        {product.description}
      </p>

      {/* (Info Blocks: Alcohol, Volume, etc.) */}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center rounded-full bg-gray-100 dark:bg-zinc-800 p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center size-10 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            -
          </button>
          <input
            className="w-12 text-center bg-transparent border-0 text-zinc-900 dark:text-white font-bold focus:ring-0"
            type="text"
            value={quantity}
            readOnly
          />
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center size-10 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-3 rounded-full h-12 bg-amber-500 text-white text-base font-bold leading-normal tracking-wide hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// (Main Page Component)
const ProductDetailPage = () => {
  const { id } = useParams(); // Get ID from router
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`); // Real API call
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <Breadcrumbs category={product.category} name={product.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
        <ProductImage image={product.image} name={product.name} />
        <ProductDetails product={product} />
      </div>

      <ProductInfoTabs />
      <RelatedProducts />
    </main>
  );
};

export default ProductDetailPage;
