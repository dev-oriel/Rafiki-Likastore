import React from "react";
import { Link } from "react-router-dom";
import imgJackDaniels from "../../assets/jackdaniels.png";

const AboutSection = () => {
  const features = [
    {
      title: "Student Prices",
      icon: "savings",
      desc: "No middleman. Just direct savings.",
    },
    {
      title: "Campus Speed",
      icon: "rocket_launch", // Material symbol
      desc: "Delivery faster than your 8 AM class.",
    },
    {
      title: "Safe & Trusted",
      icon: "verified_user",
      desc: "Genuine brands, safe delivery network.",
    },
  ];

  return (
    <section className="relative py-2 sm:py-24 overflow-hidden bg-zinc-50 dark:bg-black/20">
      {/* --- Background Decor --- */}
      {/* Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Jack Daniels Bottle - Responsive Positioning */}
      <img
        src={imgJackDaniels}
        alt="Bottle of whiskey"
        className="absolute 
          /* Mobile: Centered, faded, behind text */
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] opacity-[0.07] rotate-12 blur-[1px]
          /* Desktop: Moved to right, clearer, larger */
          lg:left-auto lg:right-[-5%] lg:w-[450px] lg:opacity-10 lg:rotate-[-15deg] lg:blur-0
          transition-all duration-700 ease-out pointer-events-none"
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 mb-6 backdrop-blur-sm">
            Rafiki Likastore
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
            For Students, <span className="text-amber-500">By Students</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Rafiki Likastore was started with one goal: to provide students
            around Kabarak with a safe, affordable, and incredibly fast way to
            get their favorite drinks. We bring the party directly to you.
          </p>
        </div>

        {/* --- Feature Grid (Makes it look premium & responsive) --- */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 hover:scale-105 hover:shadow-amber-500/40 focus:outline-none focus:ring-4 focus:ring-amber-300/50"
          >
            Learn More About Us
            <span className="material-symbols-outlined text-sm font-bold">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
