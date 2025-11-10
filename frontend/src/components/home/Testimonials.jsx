import React from "react";

// You can replace these with real reviews later
const reviews = [
  {
    quote:
      "Rafiki Likastore is a lifesaver! I get my drinks delivered right to my hostel in 30 minutes. The prices are way better than the local shop.",
    author: "Jane D., Kabarak Student",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Jane&backgroundColor=b6e3f4",
  },
  {
    quote:
      "The 'On Offer' section is my go-to. Always find great deals for the weekend. 10/10 service.",
    author: "Mike K., S Block",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Mike&backgroundColor=c0aede",
  },
  {
    quote:
      "I use this app for all our society events. Easy to order in bulk and the student discounts are legit. Highly recommend.",
    author: "Sarah W., KULCSA",
    avatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=Sarah&backgroundColor=ffd5dc",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Don't Just Take Our Word For It
          </h2>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            See what your fellow students have to say about our service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800"
            >
              <blockquote className="text-zinc-700 dark:text-zinc-300 italic text-lg">
                "{review.quote}"
              </blockquote>
              <footer className="mt-6 flex items-center gap-3">
                <img
                  className="h-12 w-12 rounded-full"
                  src={review.avatar}
                  alt={review.author}
                />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {review.author}
                  </p>
                  <div className="flex gap-0.5 text-amber-500">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "16px",
                      }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "16px",
                      }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "16px",
                      }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "16px",
                      }}
                    >
                      star
                    </span>
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "16px",
                      }}
                    >
                      star
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
