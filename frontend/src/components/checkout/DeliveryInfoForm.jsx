import React from "react";

const DeliveryInfoForm = ({ deliveryLocation, setDeliveryLocation }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
        1. Delivery Information
      </h2>
      <label
        htmlFor="deliveryLocation"
        className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
      >
        Delivery Location (Hostel, Room, or Pickup Point)
      </label>
      <textarea
        id="deliveryLocation"
        rows="3"
        value={deliveryLocation}
        onChange={(e) => setDeliveryLocation(e.target.value)}
        placeholder="e.g., Kabarak University, S Block, Room 101. Please call on arrival."
        className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-3"
        required
      />
    </div>
  );
};

export default DeliveryInfoForm;
