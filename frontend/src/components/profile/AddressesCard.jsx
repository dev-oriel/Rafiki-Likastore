import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const AddressesCard = () => {
  const { user, refreshUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    details: "",
    isPrimary: false,
  });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const saveAddresses = async (updatedAddresses, action = "saved") => {
    try {
      setLoading(true);
      await api.put("/users/profile/addresses", {
        addresses: updatedAddresses,
      });
      if (typeof refreshUser === "function") await refreshUser();
      toast.success(`Address ${action} successfully.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.details) {
      return toast.error("Please fill all fields.");
    }
    const updated = newAddress.isPrimary
      ? [
          { ...newAddress },
          ...addresses.map((a) => ({ ...a, isPrimary: false })),
        ]
      : [newAddress, ...addresses];

    setAddresses(updated);
    saveAddresses(updated, "added");
    setNewAddress({ label: "", details: "", isPrimary: false });
    setShowForm(false);
  };

  const confirmDelete = () => {
    const updated = addresses.filter((a) => a._id !== deleteId);
    setAddresses(updated);
    setDeleteId(null);
    saveAddresses(updated, "deleted");
  };

  const handleTogglePrimary = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isPrimary: (a._id || a.label) === id,
    }));
    setAddresses(updated);
    saveAddresses(updated, "updated");
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
      id="addresses"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
          Saved Addresses
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-6 space-y-4 bg-zinc-50 dark:bg-zinc-800/30">
          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
            Add a New Address
          </h4>
          <div>
            <input
              type="text"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              placeholder="Label (e.g. Home)"
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            />
          </div>
          <div>
            <textarea
              rows="2"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
              placeholder="Address Details"
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPrimary"
              type="checkbox"
              checked={newAddress.isPrimary}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isPrimary: e.target.checked })
              }
              className="h-4 w-4 text-amber-600 border-zinc-300 rounded focus:ring-amber-500"
            />
            <label
              htmlFor="isPrimary"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Set as Primary
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              disabled={loading}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map((address, index) => (
          <div
            key={address._id || index}
            className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:border-amber-200 dark:hover:border-zinc-600 transition-colors"
          >
            <div>
              <p className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                {address.label}
                {address.isPrimary && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Primary
                  </span>
                )}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                {address.details}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-2 self-end sm:self-center">
              {!address.isPrimary && (
                <button
                  onClick={() =>
                    handleTogglePrimary(address._id || address.label)
                  }
                  className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium"
                >
                  Make Primary
                </button>
              )}
              <button
                onClick={() => setDeleteId(address._id)}
                className="text-zinc-400 hover:text-red-500 p-1"
                aria-label="Delete"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal (Same logic) */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-sm w-full p-6 shadow-2xl border dark:border-zinc-800">
            <h4 className="text-lg font-bold mb-2 dark:text-white">
              Delete Address?
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesCard;
