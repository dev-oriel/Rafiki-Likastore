import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const ReviewForm = ({ orderId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!comment) {
      toast.error("Please leave a comment");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reviews", {
        orderId,
        rating,
        comment,
      });
      setSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-300">
          Thank you for your feedback!
        </h3>
        <p className="text-sm text-green-600 dark:text-green-400">
          We appreciate you taking the time to help us improve.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
        How was your experience?
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{
                    fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}`,
                    color: star <= rating ? "#f59e0b" : "#d1d5db",
                  }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Leave a comment
          </label>
          <textarea
            id="comment"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like? What can we improve?"
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-amber-500 text-white font-bold py-2.5 px-4 rounded-full text-base hover:bg-amber-600 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            "Submit Feedback"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
