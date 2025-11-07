import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AnimatePresence, motion } from "framer-motion"; // For a smooth entry/exit

// Helper to format currency
const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const CartPreview = ({ onClose }) => {
  // Get all functions and data from our CartContext
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose?.(); // Close the preview
    navigate(path); // Go to the new page
  };

  return (
    <motion.div
      className="fixed top-24 right-4 z-40"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-80 max-h-[80vh] overflow-hidden border dark:border-zinc-700">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Your Cart
            </h3>
            <button
              onClick={() => onClose?.()}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="Close cart preview"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      alt={item.name}
                      className="w-14 h-14 rounded-md object-contain bg-zinc-50 dark:bg-zinc-700 p-1 flex-shrink-0"
                      src={item.image}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.quantity} × {formatCurrency(item.price)}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-sm font-bold"
                          aria-label={`Decrease ${item.name}`}
                        >
                          -
                        </button>
                        <div className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-sm font-bold"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="ml-2 text-xs text-red-600 dark:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="font-bold text-sm text-zinc-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-700 mt-4 pt-4">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleNavigate("/cart")}
                    className="flex-1 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => handleNavigate("/checkout")}
                    className="flex-1 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CartPreview;
