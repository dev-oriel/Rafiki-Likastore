import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency"; // 1. Import KES formatter

const OrderSummary = ({ subtotal }) => {
  const navigate = useNavigate();

  const deliveryFee = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="w-full lg:w-80 lg:shrink-0">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-28">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-6">
          Order Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between text-zinc-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-900 dark:text-gray-300">
              {formatCurrency(subtotal)} {/* 2. Use KES formatter */}
            </span>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-gray-400">
            <span>Delivery Fee</span>
            <span className="font-medium text-zinc-900 dark:text-gray-300">
              {formatCurrency(deliveryFee)} {/* 3. Use KES formatter */}
            </span>
          </div>
          <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-4"></div>
          <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-gray-100">
            <span>Total</span>
            <span className="text-amber-500">{formatCurrency(total)}</span>{" "}
            {/* 4. Use KES formatter */}
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-8 bg-amber-500 text-white font-bold py-3 px-4 rounded-full text-base hover:bg-amber-600 transition-opacity"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
