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
        _id: m._id === "default" ? undefined : m._id,
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
      return toast.error("Enter a valid phone number");
    }

    const newMethod = {
      number: formatted,
      primary: paymentMethods.length === 0,
      _id: `local-${Date.now()}`,
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
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 scroll-mt-24"
      id="payment-methods"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
          Payment Methods
        </h3>
        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-amber-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add New
          </button>
        )}
      </div>

      {showNewForm && (
        <form
          onSubmit={handleAddMethod}
          className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 mb-6 space-y-4 bg-zinc-50 dark:bg-zinc-800/30"
        >
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="07XX XXX XXX"
            maxLength={10}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
            disabled={loading}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setNewNumber("");
              }}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method._id}
            className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-200 dark:hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <img
                  src="/images/mpesa.png"
                  alt="M-Pesa"
                  className="h-6 object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base dark:text-white">
                  M-Pesa
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-mono">
                  {displayPhoneNumber(method.number)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {method.primary ? (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Primary
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimary(method._id)}
                  className="text-amber-600 hover:text-amber-700 text-xs sm:text-sm font-medium"
                  disabled={loading}
                >
                  Make Primary
                </button>
              )}
              {!method.primary && (
                <button
                  onClick={() => handleDelete(method._id)}
                  className="text-zinc-400 hover:text-red-500 p-1"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
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
