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
      const { data } = await api.put(`/users/profile`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

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
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
      id="personal-info"
    >
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-6">
        Personal Information
      </h3>

      <form className="space-y-5" onSubmit={handleSaveChanges}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 0712345678"
              className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end items-center pt-2">
          <button
            type="submit"
            disabled={!isEditing || saving}
            className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoCard;
