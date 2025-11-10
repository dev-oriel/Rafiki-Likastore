import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Loader } from "lucide-react";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/reviews/featured");
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center">
            <Loader className="animate-spin text-amber-500" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show the section if no reviews are featured
  }

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
          {reviews.map((review) => {
            const avatarSrc = review.user.avatar
              ? `${API_BASE_URL}${review.user.avatar}`
              : `https://api.dicebear.com/7.x/initials/svg?seed=${review.user.name}&backgroundColor=b6e3f4`;

            return (
              <div
                key={review._id}
                className="flex flex-col justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800"
              >
                <blockquote className="text-zinc-700 dark:text-zinc-300 italic text-lg">
                  "{review.comment}"
                </blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={avatarSrc}
                    alt={review.user.name}
                  />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {review.user.name}
                    </p>
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{
                            fontVariationSettings: `'FILL' ${
                              i < review.rating ? 1 : 0
                            }`,
                            fontSize: "16px",
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                </footer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
