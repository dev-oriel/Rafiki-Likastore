import React from "react";
import mpesalogo from "../../assets/mpesa.png";

const PaymentMethodForm = ({ paymentPhone, setPaymentPhone }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-500 font-bold text-sm">
          2
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-gray-100">
          Payment Method
        </h2>
      </div>

      <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={mpesalogo}
            alt="M-Pesa"
            className="h-6 sm:h-8 object-contain"
          />
          <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm sm:text-base">
            M-Pesa Phone Number
          </span>
        </div>

        <input
          id="paymentPhone"
          type="tel"
          value={paymentPhone}
          onChange={(e) => setPaymentPhone(e.target.value)}
          placeholder="e.g., 0712345678"
          className="block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 sm:p-4 text-sm sm:text-base font-medium tracking-wide focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
          required
        />
        <p className="text-xs text-zinc-500 mt-2 ml-1">
          An STK push will be sent to this number.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
