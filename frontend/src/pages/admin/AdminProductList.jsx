import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Loader } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency"; // Import KES formatter

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // --- THIS IS THE FIX ---
      // 1. Call the correct admin route
      const { data } = await api.get("/admin/products");

      // 2. Set state directly, as data is now an array [...]
      setProducts(data);
      // --- END OF FIX ---
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        toast.success("Product deleted");
        fetchProducts(); // Refresh list
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete product");
      }
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Products
        </h1>
        <Link
          to="/admin/products/create"
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
        >
          <Plus className="size-5" />
          Create Product
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Image
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Name
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Price (KES)
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Stock
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Category
                </th>
                <th className="p-4 font-semibold text-zinc-700 dark:text-zinc-300"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4">
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `${API_BASE_URL}${product.image}`
                      }
                      alt={product.name}
                      className="size-12 rounded-md object-contain bg-zinc-100 dark:bg-zinc-700 p-1"
                    />
                  </td>
                  <td className="p-4 font-medium text-zinc-900 dark:text-white">
                    {product.name}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {product.countInStock}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {product.category}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/${product._id}/edit`)
                        }
                        className="text-zinc-500 hover:text-amber-600"
                        title="Edit"
                      >
                        <Edit className="size-5" />
                      </button>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="text-zinc-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
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

export default AdminProductList;
