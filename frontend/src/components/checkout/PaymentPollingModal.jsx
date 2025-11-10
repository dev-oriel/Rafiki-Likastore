import React from "react";
import { Loader } from "lucide-react";

const PaymentPollingModal = ({ orderId }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-xl text-center">
      <Loader className="size-12 text-amber-500 animate-spin mx-auto" />
      <h2 className="text-2xl font-bold mt-4 dark:text-white">
        Processing Payment...
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mt-2">
        A prompt has been sent to your phone. Please enter your M-Pesa PIN.
      </p>
      <p className="text-sm text-zinc-500 mt-4">
        Do not close or refresh this page.
      </p>
      <p className="text-xs text-zinc-400 mt-1">Order ID: {orderId}</p>
    </div>
  </div>
);

export default PaymentPollingModal;
