import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Use our central API
import toast from "react-hot-toast"; // Import toast

const ProfileSidebar = () => {
  const { user, logout, refreshUser } = useAuth();

  // Base URL for images
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", ""); // http://localhost:5000

  const profileImageDefault = `https://api.dicebear.com/7.x/initials/svg?seed=${
    user?.name || "User"
  }`;

  const [profileImagePreview, setProfileImagePreview] =
    useState(profileImageDefault);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.avatar) {
      // If avatar is a path (e.g., /uploads/img.png), prepend the server URL
      setProfileImagePreview(`${API_BASE_URL}${user.avatar}`);
    } else {
      setProfileImagePreview(profileImageDefault);
    }
  }, [user?.avatar, user?.name, profileImageDefault, API_BASE_URL]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // --- THIS IS THE NEW UPLOAD LOGIC ---
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Create FormData to send the file
    const formData = new FormData();
    formData.append("avatar", file); // 'avatar' must match upload.single('avatar') in backend

    setSaving(true);
    try {
      // 2. Upload the image file first
      const uploadRes = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { path } = uploadRes.data; // Get the new file path (e.g., /uploads/avatar-123.png)

      // 3. Update the profile with the *path*
      await api.put("/users/profile", { avatar: path });

      // 4. Refresh the user in context
      if (typeof refreshUser === "function") {
        await refreshUser();
      }

      toast.success("Profile picture updated!");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to save avatar.";
      console.error("Failed to upload avatar:", errorMsg);
      toast.error(errorMsg);
      // Roll back preview on failure
      setProfileImagePreview(
        user?.avatar ? `${API_BASE_URL}${user.avatar}` : profileImageDefault
      );
    } finally {
      setSaving(false);
    }
  };
  // --- END OF NEW LOGIC ---

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 sticky top-28 border dark:border-zinc-800">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-amber-500"
            // profileImagePreview is now always a full URL (http://... or https://api...)
            style={{ backgroundImage: `url(${profileImagePreview})` }}
          />
          <button
            onClick={handleEditClick}
            disabled={saving}
            title={saving ? "Saving..." : "Edit profile picture"}
            className="absolute bottom-0 right-0 bg-amber-500 text-white rounded-full p-1.5 hover:bg-amber-600 disabled:opacity-60"
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
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {user?.name || "User"}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 break-all text-sm">
          {user?.email || "—"}
        </p>
      </div>

      <nav className="space-y-2">
        <a
          className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-600 font-semibold rounded-lg"
          href="#personal-info"
        >
          <span className="material-symbols-outlined">person</span>
          <span>My Profile</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg"
          href="#favorites"
        >
          <span className="material-symbols-outlined">favorite</span>
          <span>My Favorites</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg"
          href="#order-history"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span>Order History</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg"
          href="#addresses"
        >
          <span className="material-symbols-outlined">home</span>
          <span>Saved Addresses</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 font-medium rounded-lg"
          href="#payment-methods"
        >
          <span className="material-symbols-outlined">credit_card</span>
          <span>Payment Methods</span>
        </a>

        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium rounded-lg"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
