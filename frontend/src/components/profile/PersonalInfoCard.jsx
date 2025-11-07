import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const PersonalInfoCard = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setIsEditing(true);
  };

  const handleSaveChanges = async (e) => {
    e?.preventDefault?.();
    if (saving) return;

    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

      // We already have a PUT /api/users/profile route
      const { data } = await api.put(`/users/profile`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      // Update context
      if (typeof refreshUser === "function") {
        await refreshUser();
      } else if (typeof setUser === "function") {
        setUser(data);
      }

      setIsEditing(false);
      toast.success("Profile information saved.");
    } catch (err) {
      const errText = err?.response?.data?.message || "Failed to save changes.";
      toast.error(errText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="personal-info"
    >
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Personal Information
      </h3>

      <form className="space-y-6" onSubmit={handleSaveChanges}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* We can add password change later */}

        <div className="flex justify-end items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={!isEditing || saving}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;
