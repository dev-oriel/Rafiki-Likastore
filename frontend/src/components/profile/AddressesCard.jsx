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
      const msg = err?.response?.data?.message || "Failed to save addresses";
      toast.error(msg);
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
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="addresses"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          Saved Addresses
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-6 space-y-4">
          <h4 className="font-semibold text-zinc-900 dark:text-white">
            Add a New Address
          </h4>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Label (e.g., Home, Work)
            </label>
            <input
              type="text"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              placeholder="Enter label"
              className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Address Details
            </label>
            <textarea
              rows="2"
              value={newAddress.details}
              onChange={(e) =>
                setNewAddress({ ...newAddress, details: e.target.value })
              }
              placeholder="Enter full address"
              className="mt-1 block w-full rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-2"
            />
          </div>
          <div className="flex items-center gap-3">
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
              className="text-zinc-700 dark:text-zinc-300"
            >
              Set as Primary
            </label>
          </div>
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              disabled={loading}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div
            key={address._id || index}
            className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex justify-between items-start hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">
                {address.label}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">
                {address.details}
              </p>
              {address.isPrimary && (
                <span className="mt-1 inline-block bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!address.isPrimary && (
                <button
                  onClick={() =>
                    handleTogglePrimary(address._id || address.label)
                  }
                  className="text-zinc-500 hover:text-amber-600 text-sm font-medium"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => setDeleteId(address._id)}
                className="text-zinc-500 hover:text-red-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-lg border dark:border-zinc-700">
            <h4 className="text-lg font-semibold mb-2 dark:text-white">
              Confirm Deletion
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md border dark:border-zinc-700 text-sm font-medium dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium"
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
