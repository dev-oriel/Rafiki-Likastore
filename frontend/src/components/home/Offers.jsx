import React from "react";
import { Link } from "react-router-dom";

const offers = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 13.5A8.38 8.38 0 0112.75 21a8.38 8.38 0 01-8.25-7.5m16.5 0A8.38 8.38 0 0012.75 6a8.38 8.38 0 00-8.25 7.5m16.5 0H3"
        />
      </svg>
    ),
    title: "10% Off Beers",
    text: "Grab your favorite beer brands at a 10% discount — limited time offer!",
    badge: "Hot Deal",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12a7.5 7.5 0 0115 0m0 0A7.5 7.5 0 014.5 12z"
        />
      </svg>
    ),
    title: "Buy 2 Get 1 Free",
    text: "Cocktail lovers rejoice! Buy two bottles and get one free on selected items.",
    badge: "Limited",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.25h18M3 15.75h18M9.75 3v18"
        />
      </svg>
    ),
    title: "Exclusive Whiskey Deal",
    text: "Top-shelf whiskey bottles now at 20% off — enjoy responsibly.",
    badge: "Exclusive",
  },
];

export default function Offers() {
  return (
    <section className="w-full bg-gradient-to-b from-amber-50/30 dark:from-zinc-900/30 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Special Offers
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Explore our best discounts and limited-time deals on premium drinks.
          </p>
        </div>

        {/* Scrollable row on small screens, grid on md+ */}
        <div className="relative">
          <div
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-2 md:hidden"
            role="list"
            aria-label="Offers carousel"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
          >
            {offers.map((o, i) => (
              <article
                key={i}
                role="listitem"
                tabIndex={0}
                className="snap-start flex-shrink-0 w-72 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200/40 transform transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 p-2">
                    {o.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {o.text}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase bg-amber-500 text-black px-3 py-1 rounded-full">
                    {o.badge}
                  </span>
                  <Link
                    to="/offers"
                    className="text-sm font-semibold text-amber-600 hover:underline"
                  >
                    See offers →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop grid */}
          <div
            className="hidden md:grid md:grid-cols-3 md:gap-8"
            role="list"
            aria-label="Offers grid"
          >
            {offers.map((o, i) => (
              <article
                key={i}
                role="listitem"
                tabIndex={0}
                className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-200/40 transform transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 p-3">
                    {o.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {o.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {o.text}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase bg-amber-500 text-black px-3 py-1 rounded-full">
                    {o.badge}
                  </span>
                  <Link
                    to="/offers"
                    className="text-sm font-semibold text-amber-600 hover:underline"
                  >
                    See offers →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Small stylesheet to hide scrollbars in supported browsers (no Tailwind plugin required) */}
      <style>{`
        /* hide scrollbar for WebKit/Blink browsers */
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        /* hide scrollbar for Firefox */
        .overflow-x-auto { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  );
}
