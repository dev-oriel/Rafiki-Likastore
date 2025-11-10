import React from "react";
import { Link } from "react-router-dom";
import imgJackDaniels from "../../assets/jackdaniels.png"; // Using this as a nice bg image

const AboutSection = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Image */}
      <img
        src={imgJackDaniels}
        alt="Bottle of whiskey"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-auto opacity-5 dark:opacity-10 blur-md -rotate-12"
      />

      <div className="relative container mx-auto max-w-3xl text-center px-4 z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          For Students, By Students
        </h2>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Rafiki Likastore was started with one goal: to provide students around
          Kabarak with a safe, affordable, and incredibly fast way to get their
          favorite drinks. We cut out the middleman, partner with trusted
          brands, and use a student-first delivery network to bring the savings
          (and the party) directly to you.
        </p>
        <div className="mt-10">
          <Link
            to="/about" // You can create this page later
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
