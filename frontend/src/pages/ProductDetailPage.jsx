import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import RelatedProducts from "../components/product/RelatedProducts";
import ProductInfoTabs from "../components/product/ProductInfoTabs";
import { Loader } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

// --- Components ---

const Breadcrumbs = ({ category, name }) => (
  <nav
    aria-label="Breadcrumb"
    className="mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2"
  >
    <ol className="flex items-center gap-2">
      <li>
        <Link
          className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-xs sm:text-sm font-medium transition-colors"
          to="/"
        >
          Home
        </Link>
      </li>
      <li className="text-zinc-400 text-xs sm:text-sm">/</li>
      <li>
        <Link
          className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-xs sm:text-sm font-medium transition-colors"
          to="/shop"
        >
          Shop
        </Link>
      </li>
      <li className="text-zinc-400 text-xs sm:text-sm">/</li>
      <li>
        <span
          className="text-zinc-900 dark:text-white text-xs sm:text-sm font-medium"
          aria-current="page"
        >
          {name}
        </span>
      </li>
    </ol>
  </nav>
);

const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const ProductImage = ({ image, name }) => (
  <div className="w-full aspect-square md:aspect-3/4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 flex items-center justify-center relative group overflow-hidden border border-zinc-100 dark:border-zinc-800">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"></div>

    <img
      src={image.startsWith("http") ? image : API_BASE_URL + image}
      alt={name}
      className="relative z-10 w-full h-full object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-105"
      style={{ filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.15))" }}
    />
  </div>
);

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      {/* Header Info */}
      <div className="space-y-1 sm:space-y-2">
        <p className="text-amber-600 dark:text-amber-500 text-[10px] sm:text-sm font-bold uppercase tracking-widest">
          {product.category}
        </p>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">
          {product.name}
        </h1>
      </div>

      {/* Rating & Reviews */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`material-symbols-outlined text-[18px] sm:text-[24px] ${
                star <= (product.rating || 4.5)
                  ? "text-amber-500 font-variation-fill"
                  : "text-zinc-300 dark:text-zinc-600"
              }`}
              style={{
                fontVariationSettings: `'FILL' ${
                  star <= (product.rating || 4.5) ? 1 : 0
                }`,
              }}
            >
              star
            </span>
          ))}
        </div>
        <span className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium">
          4.5 <span className="hidden sm:inline">(128 Reviews)</span>
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 sm:gap-4">
        <p className="text-2xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white">
          {formatCurrency(product.price)}
        </p>
        {product.isOnSale && (
          <span className="rounded-full bg-amber-100 dark:bg-amber-500/20 px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
            On Offer
          </span>
        )}
      </div>

      <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-prose">
        {product.description}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
          <span className="material-symbols-outlined text-zinc-400 text-xl sm:text-2xl">
            local_bar
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              Type
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-20">
              {product.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
          <span
            className={`material-symbols-outlined text-xl sm:text-2xl ${
              product.countInStock > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.countInStock > 0 ? "check_circle" : "cancel"}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              Status
            </span>
            <span
              className={`text-xs sm:text-sm font-semibold ${
                product.countInStock > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600"
              }`}
            >
              {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 sm:gap-2 text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
          <span className="material-symbols-outlined text-amber-500 text-xl sm:text-2xl">
            rocket_launch
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              Delivery
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
              20 Mins
            </span>
          </div>
        </div>
      </div>

      {/* --- ACTIONS SECTION (Fix applied here) --- */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between sm:justify-start bg-zinc-100 dark:bg-zinc-800 rounded-full p-1.5 w-full sm:w-auto">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 text-zinc-500 shadow-sm transition-all active:scale-90 hover:text-amber-600"
            disabled={product.countInStock === 0}
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="w-12 text-center font-bold text-base sm:text-lg text-zinc-900 dark:text-white">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((q) => Math.min(product.countInStock, q + 1))
            }
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white dark:bg-zinc-700 text-zinc-500 shadow-sm transition-all active:scale-90 hover:text-amber-600"
            disabled={product.countInStock === 0}
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        {/* Add to Cart Button - STYLING FIX */}
        <button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
          className="
            flex-1 
            py-3.5 sm:py-4            /* Padding Y for better look */
            rounded-full 
            bg-amber-500 
            text-white 
            font-bold 
            text-sm sm:text-lg        /* Smaller text on mobile */
            shadow-lg shadow-amber-500/20 
            hover:bg-amber-600 
            hover:scale-[1.02] 
            active:scale-[0.98] 
            transition-all 
            disabled:opacity-50 
            disabled:cursor-not-allowed 
            flex items-center justify-center gap-2
          "
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }} /* Smaller icon on mobile */
          >
            shopping_cart
          </span>
          {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

// --- Main Page ---

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
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
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader className="animate-spin text-amber-500 w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="material-symbols-outlined text-6xl text-zinc-300">
          broken_image
        </span>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {error}
        </h2>
        <Link to="/shop" className="text-amber-500 font-medium hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
      <Breadcrumbs category={product.category} name={product.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start mb-12 sm:mb-24">
        <ProductImage image={product.image} name={product.name} />
        <ProductDetails product={product} />
      </div>

      <div className="space-y-12 sm:space-y-24">
        <ProductInfoTabs product={product} />
        <RelatedProducts
          category={product.category}
          currentProductId={product._id}
        />
      </div>
    </main>
  );
};

export default ProductDetailPage;
