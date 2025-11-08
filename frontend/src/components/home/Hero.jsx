import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons for navigation

// Import your local images from the assets folder
import imgJameson from "../../assets/jameson.png";
import imgJackDaniels from "../../assets/jackdaniels.png";
import imgBlackLabel from "../../assets/blacklabel.png";
import imgRedLabel from "../../assets/redlabel.jpg";
import imgChateau from "../../assets/chateau.png";

export default function Hero() {
  // Define a list of products for the carousel
  const heroProducts = [
    {
      name: "Jack Daniels Whiskey",
      volume: "750ml",
      abv: "40% ABV",
      price: "KSH 3,200",
      image: imgJackDaniels,
    },
    {
      name: "Jameson Irish Whiskey",
      volume: "750ml",
      abv: "40% ABV",
      price: "KSH 2,800",
      image: imgJameson,
    },
    {
      name: "Johnnie Walker Black Label",
      volume: "750ml",
      abv: "40% ABV",
      price: "KSH 4,500",
      image: imgBlackLabel,
    },
    {
      name: "Johnnie Walker Red Label",
      volume: "750ml",
      abv: "40% ABV",
      price: "KSH 2,500",
      image: imgRedLabel,
    },
    {
      name: "Chateau Rouge Wine",
      volume: "750ml",
      abv: "12.5% ABV",
      price: "KSH 1,500",
      image: imgChateau,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0); // State to manage current active product

  const nextProduct = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === heroProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevProduct = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? heroProducts.length - 1 : prevIndex - 1
    );
  };

  const currentProduct = heroProducts[activeIndex];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
    >
      <div className="container mx-auto px-6 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1
              id="hero-heading"
              className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
            >
              <span className="block">Your Friendly Neighborhood</span>
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                Liquor Stop — delivered fast.
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-base text-zinc-600 dark:text-zinc-300 md:text-lg lg:mx-0">
              Affordable drinks from trusted brands students love. Fast
              delivery, transparent pricing — and a rewards program that
              actually rewards you.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-amber-300"
                aria-label="Shop now — open shop page"
              >
                Shop Now
                <svg
                  className="ml-3 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                to="/offers"
                className="mx-auto inline-flex items-center justify-center rounded-full border border-amber-200 px-5 py-3 text-sm font-semibold text-amber-700 shadow-sm bg-white/60 backdrop-blur-sm transition hover:bg-amber-50 sm:mx-0 dark:bg-zinc-800/60 dark:text-amber-400"
                aria-label="See current offers"
              >
                View Offers
              </Link>
            </div>

            <ul className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Free delivery •
                </span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Trusted brands •
                </span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 font-medium">
                  Student discounts
                </span>
              </li>
            </ul>
          </div>

          {/* Dynamic Image Display with Toggle */}
          <div className="relative flex min-h-[400px] items-center justify-center lg:min-h-[500px]">
            {/* Navigation buttons */}
            <button
              onClick={prevProduct}
              aria-label="Previous product"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm shadow-md transition hover:scale-105"
            >
              <ChevronLeft className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </button>
            <button
              onClick={nextProduct}
              aria-label="Next product"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm shadow-md transition hover:scale-105"
            >
              <ChevronRight className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </button>

            {/* Product Card and Image */}
            <div className="relative w-full h-full flex justify-center items-center">
              <div className="relative z-10 p-6 rounded-2xl bg-white/60 shadow-2xl backdrop-blur-md dark:bg-zinc-900/60 flex flex-col justify-end min-h-[300px] lg:min-h-[400px] w-80 sm:w-96">
                {/* --- THIS IS THE FIX --- */}
                {/* Added -rotate-12 for the left tilt */}
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-full object-contain max-h-[500px] w-auto transition-transform duration-300 ease-in-out hover:scale-105 z-0 -rotate-12"
                />
                {/* --- END OF FIX --- */}

                {/* Product details at the bottom of the card */}
                <div className="mt-auto relative z-10 bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl backdrop-blur-sm">
                  <p className="text-xl font-medium text-zinc-800 dark:text-zinc-100">
                    {currentProduct.name}
                  </p>
                  <p className="text-base text-zinc-500 dark:text-zinc-400">
                    {currentProduct.volume} • {currentProduct.abv}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-semibold text-amber-600">
                      {currentProduct.price}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Free delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-amber-500 w-4"
                      : "bg-zinc-400 dark:bg-zinc-600"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-6 h-6 w-full rounded-full blur-3xl opacity-40 bg-gradient-to-r from-amber-200 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
