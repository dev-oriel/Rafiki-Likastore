import React from "react";

const OfferCard = ({ icon, title, text }) => (
  <div className="flex min-w-72 flex-1 flex-col gap-4 rounded-lg bg-white dark:bg-zinc-900 p-6 border-2 border-amber-500/50">
    {" "}
    {/* Updated color */}
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-amber-500 text-3xl">
        {icon}
      </span>{" "}
      {/* Updated color */}
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">{text}</p>{" "}
    {/* Updated color */}
  </div>
);

const Offers = () => {
  const offers = [
    {
      icon: "celebration",
      title: "Happy Hour Deals",
      text: "Get up to 20% off on select drinks. Perfect for your pre-game.",
    },
    {
      icon: "liquor",
      title: "Weekend Mixes",
      text: "Special bundles for your weekend party. Everything you need in one box.",
    },
    {
      icon: "school",
      title: "Student Discounts",
      text: "Verify your student ID for exclusive offers and save more.",
    },
    {
      icon: "local_shipping",
      title: "Free Delivery",
      text: "Enjoy free and fast delivery on all orders over $50.",
    },
  ];

  return (
    <section className="w-full bg-gray-50 dark:bg-zinc-800 py-16 sm:py-24">
      {" "}
      {/* Updated color */}
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4">
          <div className="flex items-stretch px-4 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.title} {...offer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
