import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
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

          <div className="relative flex items-center justify-center">
            <div className="relative w-[380px] max-w-full rounded-2xl bg-white/60 p-6 shadow-2xl backdrop-blur-md dark:bg-zinc-900/60">
              <div className="relative flex h-64 items-end justify-center">
                <img
                  src="https://images.unsplash.com/photo-1616599323558-5e8f7d97f0c3?auto=format&fit=crop&w=400&q=80"
                  alt="Jameson Irish Whiskey"
                  className="absolute -left-10 w-28 transform-gpu -translate-y-6 rotate-[-10deg] transition-transform hover:scale-105 rounded-lg"
                />

                <img
                  src="https://images.unsplash.com/photo-1581388847562-2ce663d8d6c5?auto=format&fit=crop&w=400&q=80"
                  alt="Smirnoff No. 21 Vodka"
                  className="z-20 w-44 transform-gpu transition-transform hover:scale-105 rounded-lg"
                />

                <img
                  src="https://images.unsplash.com/photo-1603046891743-86e7c5bba3b3?auto=format&fit=crop&w=400&q=80"
                  alt="Captain Morgan Spiced Rum"
                  className="absolute -right-8 w-28 transform-gpu translate-y-3 rotate-6 transition-transform hover:scale-105 rounded-lg"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    Smirnoff No. 21 Vodka
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    750ml • 40% ABV
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-600">
                    KSH 1,850
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Free delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-6 h-6 w-80 rounded-full blur-3xl opacity-40 bg-gradient-to-r from-amber-200 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
