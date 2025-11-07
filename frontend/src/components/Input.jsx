import React from "react";

const Input = ({ Icon, type, placeholder, value, onChange }) => {
  return (
    <div className="relative mb-4">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="size-5 text-zinc-400" />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
};

export default Input;
