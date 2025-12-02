import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const OrderSummary = ({ subtotal }) => {
  const navigate = useNavigate();

  // Simple delivery logic (can be expanded later)
  const deliveryFee = subtotal > 0 ? 50.0 : 0.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="w-full lg:w-96 lg:shrink-0 mt-4 lg:mt-0">
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm lg:sticky lg:top-24">
        {/* Header */}
        <h2 className="text-base sm:text-xl font-black text-zinc-900 dark:text-gray-100 mb-4 sm:mb-6">
          Order Summary
        </h2>

        {/* Calculations */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between text-sm sm:text-md text-zinc-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-bold text-zinc-900 dark:text-gray-200">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-sm sm:text-md text-zinc-600 dark:text-gray-400">
            <span>Delivery Fee</span>
            <span className="font-bold text-zinc-900 dark:text-gray-200">
              {formatCurrency(deliveryFee)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-2"></div>

          {/* Total Row */}
          <div className="flex justify-between items-end">
            <span className="text-base font-bold text-zinc-900 dark:text-gray-100">
              Total
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-500 leading-none">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-amber-500 text-white font-bold py-3 sm:py-4 px-4 rounded-full text-sm sm:text-base hover:bg-amber-600 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Proceed to Checkout
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-4 opacity-70">
          <span className="material-symbols-outlined text-sm text-zinc-400">
            lock
          </span>
          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
            Secure Checkout via M-Pesa
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
