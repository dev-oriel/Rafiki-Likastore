import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Loader, Upload } from "lucide-react";
import { CATEGORIES } from "../../constants/categories";

const AdminProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/products/${productId}`);
          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
          setIsOnSale(data.isOnSale);
          setDiscountedPrice(data.discountedPrice || 0);
        } catch (err) {
          toast.error("Product not found");
          navigate("/admin/products");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);

    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(data.path);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name,
      price,
      image,
      category,
      countInStock,
      description,
      isOnSale,
      discountedPrice: discountedPrice || 0,
    };

    try {
      if (productId) {
        await api.put(`/admin/products/${productId}`, productData);
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", productData);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (loading && productId)
    return (
      <div className="flex justify-center">
        <Loader className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        to="/admin/products"
        className="text-sm font-medium text-amber-600 hover:underline"
      >
        &larr; Go Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        {productId ? "Edit Product" : "Create Product"}
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Original Price (KES)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Count In Stock
            </label>
            <input
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
              required
            />
          </div>
        </div>

        {/* --- THIS IS THE FIX --- */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isOnSale"
              checked={isOnSale}
              onChange={(e) => setIsOnSale(e.target.checked)}
              className="h-5 w-5 rounded text-amber-500 focus:ring-amber-500"
            />
            {/* 1. Updated label text */}
            <label
              htmlFor="isOnSale"
              className="font-medium text-zinc-900 dark:text-amber-100"
            >
              Put this item on offer
            </label>
          </div>
          {isOnSale && (
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Discounted Price (KES)
              </label>
              <input
                type="number"
                step="0.01"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
                placeholder="Enter the new sale price"
              />
            </div>
          )}
        </div>
        {/* --- END OF FIX --- */}

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Image
          </label>
          <div className="mt-1 flex items-center gap-4">
            {image && (
              <img
                src={
                  image.startsWith("http") ? image : `${API_BASE_URL}${image}`
                }
                alt="Preview"
                className="size-16 rounded-md object-contain bg-zinc-100 dark:bg-zinc-800 p-1"
              />
            )}
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
              placeholder="/uploads/image.png"
              readOnly={uploading}
            />
            <label className="cursor-pointer bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 p-3 rounded-lg">
              <Upload className="size-5" />
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>
          {uploading && <Loader className="animate-spin mt-2" />}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm p-3"
            required
          />
        </div>

        <div className="pt-4 text-right">
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : productId
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;
