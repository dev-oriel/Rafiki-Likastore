import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Loader, Star, Check, X } from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/reviews");
      setReviews(data);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleFeatureHandler = async (id, currentStatus) => {
    try {
      await api.put(`/admin/reviews/${id}`, {
        isFeatured: !currentStatus,
      });
      toast.success(currentStatus ? "Review un-featured" : "Review featured!");
      fetchReviews(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Manage Reviews
      </h1>
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  User
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Rating
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Comment
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Featured
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4 align-top">
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {review.user?.name || "N/A"}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {review.user?.email || "N/A"}
                    </p>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-1 text-amber-500">
                      {review.rating} <Star size={16} fill="currentColor" />
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400 max-w-sm">
                    {review.comment}
                  </td>
                  <td className="p-4 align-top text-center">
                    {review.isFeatured ? (
                      <Check className="text-green-500 mx-auto" />
                    ) : (
                      <X className="text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 align-top text-right">
                    <button
                      onClick={() =>
                        toggleFeatureHandler(review._id, review.isFeatured)
                      }
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        review.isFeatured
                          ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {review.isFeatured ? "Un-feature" : "Feature"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
