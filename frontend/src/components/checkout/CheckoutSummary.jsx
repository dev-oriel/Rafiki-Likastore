import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const CheckoutSummary = ({ items, subtotal, deliveryFee, total }) => (
  <div className="bg-white  dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
    <h2 className="text-lg  sm:text-xl font-bold text-zinc-900 dark:text-gray-100  mb-2 sm:mb-6">
      Order Summary
    </h2>

    {/* FIX: Added 'p-2' here. 
        This adds internal padding so the negative-positioned badge (-top-2) 
        doesn't get cut off by the overflow-hidden boundary. 
    */}
    <div className=" space-y-0.5 sm:space-y-4 max-h-60 overflow-y-auto p-2 custom-scrollbar">
      {items.map((item) => {
        const quantity = item.quantity || item.qty;
        const priceToUse =
          item.isOnSale && item.discountedPrice > 0
            ? item.discountedPrice
            : item.price;

        return (
          <div
            key={item._id || item.product}
            className="flex justify-between  items-start text-sm"
          >
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_URL.replace("/api", "")}${
                          item.image
                        }`
                  }
                  alt={item.name}
                  className="size-10 rounded-lg object-contain bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
                />
                <span className="absolute -top-2 -right-2 bg-zinc-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full  border-white dark:border-zinc-900 shadow-sm">
                  {quantity}
                </span>
              </div>
              <div className="min-w-0 pr-2">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {formatCurrency(priceToUse)}
                </p>
              </div>
            </div>
            <p className="font-bold text-zinc-900 dark:text-zinc-300 shrink-0">
              {formatCurrency(priceToUse * quantity)}
            </p>
          </div>
        );
      })}
    </div>

    <div className="border-t  border-dashed border-zinc-200 dark:border-zinc-700 my-1 sm:my-4"></div>

    <div className="space-y-1 sm:space-y-3 ">
      <div className="flex justify-between text-sm text-zinc-600 dark:text-gray-400">
        <span>Subtotal</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className="flex justify-between text-sm text-zinc-600 dark:text-gray-400">
        <span>Delivery Fee</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(deliveryFee)}
        </span>
      </div>
    </div>

    <div className="border-t  border-solid border-zinc-200 dark:border-zinc-700 my-1 sm:my-4"></div>

    <div className="flex justify-between items-end">
      <span className="text-base font-bold text-zinc-900 dark:text-gray-100">
        Total
      </span>
      <span className="text-md sm:text-xl font-black text-amber-500 leading-none">
        {formatCurrency(total)}
      </span>
    </div>
  </div>
);

export default CheckoutSummary;
