import React from "react";
import { Link } from "react-router-dom";

const PaymentMethodForm = ({ paymentPhone, setPaymentPhone }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
        2. Payment Method
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
        An STK push will be sent to the number below.
      </p>
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="paymentPhone"
            className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200"
          >
            <img src="/images/mpesa.png" alt="M-Pesa" className="h-8" />
            M-Pesa Phone Number
          </label>
          <Link
            to="/profile#payment-methods"
            className="text-sm font-medium text-amber-600 hover:underline"
          >
            Manage
          </Link>
        </div>
        <input
          id="paymentPhone"
          type="tel"
          value={paymentPhone}
          onChange={(e) => setPaymentPhone(e.target.value)}
          placeholder="e.g., 0712345678"
          className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-3"
          required
        />
      </div>
    </div>
  );
};

export default PaymentMethodForm;
