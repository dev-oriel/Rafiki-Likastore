import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RelatedProducts from "../components/product/RelatedProducts";
import ProductInfoTabs from "../components/product/ProductInfoTabs";

// --- Mock Data ---
// In a real app, you'd fetch this from your API using the `slug`
const product = {
  category: "Rum",
  name: "Captain Morgan Spiced Gold",
  slug: "captain-morgan-spiced-gold",
  rating: 4.5,
  reviews: 128,
  price: 24.99,
  description:
    "A secret recipe of adventurous spice & natural flavours that are expertly blended with fine Caribbean rum – then aged in charred white oak barrels to create a taste and colour as rich as a pocketful of gold doubloons.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6Ha8tll4M4cyfG9dqsqNvzB_PxEhqIORmd5wrFRLUj6Gyjo_8XKYUuLIXzemGt0JQEsJQuJVnR1NXCyS4Epa3ejO2KSIfirbgE7as-GGEnFUVzNr4Wet0ljILLY-hxZLuOc4ILiisUHPgFWSdgTg1UlhU5Bz9O41SIBavKD9rYYwYg2hPs52IEu_i1fBF0CmNALOPqpuTF5Mb_PoMC_IHpyob25kqqttUM4jBsQ-KuyCzxR6gCW2qjBXQXO1GAxnChxkZ_glAoY",
  details: [
    { icon: "liquor", label: "Alcohol", value: "35%" },
    { icon: "straighten", label: "Volume", value: "700ml" },
    { icon: "public", label: "Origin", value: "Jamaica" },
  ],
};
// --- End Mock Data ---

const Breadcrumbs = ({ category, name, slug }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    <Link
      className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-sm font-medium leading-normal transition-colors"
      to="/"
    >
      Home
    </Link>
    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-normal">
      /
    </span>
    <Link
      className="text-zinc-500 dark:text-zinc-400 hover:text-amber-500 text-sm font-medium leading-normal transition-colors"
      to="/shop?category=rum"
    >
      {category}
    </Link>
    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-normal">
      /
    </span>
    <span className="text-zinc-900 dark:text-white text-sm font-medium leading-normal">
      {name}
    </span>
  </div>
);

const ProductImage = ({ image, name }) => (
  <div className="w-full aspect-[3/4] rounded-lg bg-white dark:bg-zinc-900/50 p-6 flex items-center justify-center relative group">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-2/5 bg-amber-500/20 blur-3xl rounded-full"></div>
    <div
      className="w-full h-full bg-center bg-no-repeat bg-contain transition-transform duration-300 group-hover:scale-110 z-10"
      alt={name}
      style={{ backgroundImage: `url("${image}")` }}
    ></div>
  </div>
);

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // In a real app, you'd also call your cart context here
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
        <div className="flex gap-0.5">
          {/* Simple rating stars */}
          <span
            className="material-symbols-outlined text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
          >
            star
          </span>
          <span
            className="material-symbols-outlined text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
          >
            star
          </span>
          <span
            className="material-symbols-outlined text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
          >
            star
          </span>
          <span
            className="material-symbols-outlined text-amber-500"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
          >
            star
          </span>
          <span
            className="material-symbols-outlined text-amber-500/40"
            style={{ fontSize: "20px" }}
          >
            star
          </span>
        </div>
        <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
          {product.rating} ({product.reviews} Reviews)
        </span>
      </div>

      <p className="text-zinc-900 dark:text-white text-5xl font-extrabold">
        ${product.price.toFixed(2)}
      </p>

      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-prose">
        {product.description}
      </p>

      <div className="grid grid-cols-3 gap-4 border-t border-b border-zinc-200 dark:border-zinc-800 py-4">
        {product.details.map((detail) => (
          <div
            key={detail.label}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400 text-2xl">
              {detail.icon}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {detail.label}
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

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

// Main Page Component
const ProductDetailPage = () => {
  // const { slug } = useParams(); // Use this to fetch data
  // For now, we use the mock 'product' object

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
