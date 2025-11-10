import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const CheckoutSummary = ({ items, subtotal, deliveryFee, total }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
    <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-6">
      Order Summary
    </h2>
    <div className="space-y-4">
      {items.map((item) => {
        // --- THIS IS THE FIX ---
        // 1. Check for 'quantity' (from CartContext) OR 'qty' (from Order model)
        const quantity = item.quantity || item.qty;

        // 2. Determine the correct price to use
        const priceToUse =
          item.isOnSale && item.discountedPrice > 0
            ? item.discountedPrice
            : item.price;
        // --- END OF FIX ---

        return (
          <div
            key={item._id || item.product} // Use _id (cart) or product (order)
            className="flex justify-between items-center text-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL.replace("/api", "")}${
                        item.image
                      }`
                }
                alt={item.name}
                className="size-10 rounded-md object-contain bg-zinc-50 dark:bg-zinc-800"
              />
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Qty: {quantity} {/* 3. Use the unified quantity variable */}
                </p>
              </div>
            </div>
            <p className="font-medium text-zinc-900 dark:text-zinc-300">
              {/* 4. Use the unified variables for calculation */}
              {formatCurrency(priceToUse * quantity)}
            </p>
          </div>
        );
      })}
      <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Subtotal</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Delivery Fee</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(deliveryFee)}
        </span>
      </div>
      <div className="border-t border-solid border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-gray-100">
        <span>Total</span>
        <span className="text-amber-500">{formatCurrency(total)}</span>
      </div>
    </div>
  </div>
);

export default CheckoutSummary;
