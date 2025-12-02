import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProfileSidebar = () => {
  const { user, logout, refreshUser } = useAuth();

  // Base URL (e.g., http://localhost:5000)
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const profileImageDefault = `https://api.dicebear.com/7.x/initials/svg?seed=${
    user?.name || "User"
  }`;

  // --- HELPER FUNCTION FOR IMAGES ---
  const getImageUrl = (path) => {
    if (!path) return profileImageDefault;
    if (path.startsWith("http")) return path;

    // 1. Replace backslashes with forward slashes (Windows fix)
    const cleanPath = path.replace(/\\/g, "/");

    // 2. Ensure it starts with a slash
    const formattedPath = cleanPath.startsWith("/")
      ? cleanPath
      : `/${cleanPath}`;

    return `${API_BASE_URL}${formattedPath}`;
  };
  // ----------------------------------

  const [profileImagePreview, setProfileImagePreview] =
    useState(profileImageDefault);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Update preview when user data changes
  useEffect(() => {
    if (user?.avatar) {
      setProfileImagePreview(getImageUrl(user.avatar));
    } else {
      setProfileImagePreview(profileImageDefault);
    }
  }, [user?.avatar, user?.name, profileImageDefault, API_BASE_URL]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Optimistic UI update (Show image immediately before upload finishes)
    const objectUrl = URL.createObjectURL(file);
    setProfileImagePreview(objectUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    setSaving(true);
    try {
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { path } = uploadRes.data; // This might be "uploads\image.png"

      await api.put("/users/profile", { avatar: path });

      if (typeof refreshUser === "function") {
        await refreshUser();
      }
      toast.success("Profile picture updated!");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to save avatar.";
      toast.error(errorMsg);
      // Revert on failure
      setProfileImagePreview(getImageUrl(user?.avatar));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 lg:sticky lg:top-24 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cover bg-center border-4 border-amber-500 shadow-sm"
            // Use the state which is now safe
            style={{ backgroundImage: `url('${profileImagePreview}')` }}
          />
          <button
            onClick={handleEditClick}
            disabled={saving}
            className="absolute bottom-0 right-0 bg-amber-500 text-white rounded-full p-1.5 hover:bg-amber-600 disabled:opacity-60 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white text-center">
          {user?.name || "User"}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 break-all text-xs sm:text-sm text-center">
          {user?.email || "—"}
        </p>
      </div>

      <nav className="space-y-1 sm:space-y-2">
        <a
          className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 text-amber-700 font-semibold rounded-lg text-sm sm:text-base transition-colors"
          href="#personal-info"
        >
          <span className="material-symbols-outlined text-lg">person</span>
          <span>My Profile</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2.5 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg text-sm sm:text-base transition-colors"
          href="#favorites"
        >
          <span className="material-symbols-outlined text-lg">favorite</span>
          <span>My Favorites</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2.5 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg text-sm sm:text-base transition-colors"
          href="#order-history"
        >
          <span className="material-symbols-outlined text-lg">
            receipt_long
          </span>
          <span>Order History</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2.5 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg text-sm sm:text-base transition-colors"
          href="#addresses"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          <span>Saved Addresses</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-2.5 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg text-sm sm:text-base transition-colors"
          href="#payment-methods"
        >
          <span className="material-symbols-outlined text-lg">credit_card</span>
          <span>Payment Methods</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full mt-4 flex items-center gap-3 px-4 py-2.5 text-zinc-700 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 font-medium rounded-lg text-sm sm:text-base transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
