import React from "react";

const AdminTransactions = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Transactions
      </h1>
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">M-Pesa Callbacks</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          This is where you would list all incoming M-Pesa transaction logs and
          callbacks from your database.
        </p>
      </div>
    </div>
  );
};

export default AdminTransactions;
