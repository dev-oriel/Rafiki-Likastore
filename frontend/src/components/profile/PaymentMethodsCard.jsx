import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

const formatPhoneNumber = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("07")) return `254${digits.substring(1)}`;
  if (digits.startsWith("7")) return `254${digits}`;
  return digits;
};

const displayPhoneNumber = (value) => {
  if (value.startsWith("254") && value.length === 12) {
    return `+254 ${value.substring(3, 6)} ${value.substring(
      6,
      9
    )} ${value.substring(9)}`;
  }
  return value;
};

const PaymentMethodsCard = () => {
  const { user, refreshUser } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const methods = user.paymentMethods || [];
    if (methods.length === 0 && user.phone) {
      setPaymentMethods([
        { number: user.phone, primary: true, _id: "default" },
      ]);
    } else {
      setPaymentMethods(methods);
    }
  }, [user]);

  const savePaymentMethods = async (methods) => {
    try {
      setLoading(true);
      const payload = methods.map((m) => ({
        number: m.number,
        primary: m.primary,
        _id: m._id === "default" ? undefined : m._id, // Don't send placeholder ID
      }));
      await api.put("/users/profile/payment-methods", {
        paymentMethods: payload,
      });
      if (typeof refreshUser === "function") await refreshUser();
      toast.success("Payment methods saved.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save methods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = (e) => {
    e?.preventDefault?.();
    const formatted = formatPhoneNumber(newNumber);
    if (!formatted || formatted.length !== 12) {
      return toast.error("Enter a valid phone number (e.g., 0712345678)");
    }

    const newMethod = {
      number: formatted,
      primary: paymentMethods.length === 0,
      _id: `local-${Date.now()}`, // Temporary local ID
    };

    const updated = newMethod.primary
      ? [newMethod, ...paymentMethods.map((m) => ({ ...m, primary: false }))]
      : [newMethod, ...paymentMethods];

    setPaymentMethods(updated);
    savePaymentMethods(updated);
    setNewNumber("");
    setShowNewForm(false);
  };

  const handleDelete = (id) => {
    let updated = paymentMethods.filter((m) => m._id !== id);
    const wasPrimary = paymentMethods.find((m) => m._id === id)?.primary;
    if (wasPrimary && updated.length > 0 && !updated.some((m) => m.primary)) {
      updated[0].primary = true;
    }
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  const handleSetPrimary = (id) => {
    const updated = paymentMethods.map((m) => ({
      ...m,
      primary: m._id === id,
    }));
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 border dark:border-zinc-800"
      id="payment-methods"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          Payment Methods
        </h3>
        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm flex items-center gap-2"
            disabled={loading}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Method
          </button>
        )}
      </div>

      {showNewForm && (
        <form
          onSubmit={handleAddMethod}
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-6 space-y-4"
        >
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="07XX XXX XXX"
            maxLength={10}
            className="w-full border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-amber-500/20 focus:border-amber-500"
            disabled={loading}
          />
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setNewNumber("");
              }}
              className="text-sm font-medium text-red-500 hover:underline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Method"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method._id}
            className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Add your mpesa.png to /public/images/ */}
              <img src="/images/mpesa.png" alt="M-Pesa" className="h-8" />
              <div>
                <p className="font-semibold dark:text-white">M-Pesa</p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {displayPhoneNumber(method.number)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {method.primary ? (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Primary
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimary(method._id)}
                  className="text-zinc-500 hover:text-amber-600 text-sm font-medium"
                  disabled={loading}
                >
                  Set as primary
                </button>
              )}
              {!method.primary && (
                <button
                  onClick={() => handleDelete(method._id)}
                  className="text-zinc-500 hover:text-red-500"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsCard;
