import React from "react";

const DeliveryInfoForm = ({ deliveryLocation, setDeliveryLocation }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 font-bold text-sm">
          1
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-gray-100">
          Delivery Details
        </h2>
      </div>

      <label
        htmlFor="deliveryLocation"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
      >
        Where should we bring your drinks?
      </label>
      <textarea
        id="deliveryLocation"
        rows="3"
        value={deliveryLocation}
        onChange={(e) => setDeliveryLocation(e.target.value)}
        placeholder="e.g., Kabarak University, S Block, Room 101. Please call on arrival."
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 sm:p-4 text-sm sm:text-base focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none resize-none placeholder:text-zinc-400"
        required
      />
    </div>
  );
};

export default DeliveryInfoForm;
