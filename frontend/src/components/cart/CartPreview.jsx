import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";

// Safe check for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "";

const CartPreview = ({ onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop: Darkens background slightly and allows closing by tapping outside */}
      <div
        className="fixed inset-0 z-40 bg-black/20 md:hidden"
        onClick={() => onClose?.()}
      />

      <motion.div
        /* RESPONSIVE POSITIONING:
           Mobile: top-20, left-4, right-4 (Stretches across screen with margin)
           Desktop: top-24, right-8, width-96 (Standard dropdown)
        */
        className="fixed z-50 top-20 left-4 right-4 md:left-auto md:right-8 md:top-24 md:w-96"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex flex-col max-h-[75vh]">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 backdrop-blur-sm">
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                shopping_bag
              </span>
              Your Cart
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 ml-1">
                ({cartItems.length})
              </span>
            </h3>
            <button
              onClick={() => onClose?.()}
              className="p-2 -mr-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
              aria-label="Close cart preview"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-zinc-400">
                  production_quantity_limits
                </span>
              </div>
              <p className="text-zinc-900 dark:text-white font-medium mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Looks like you haven't added any drinks yet.
              </p>
              <button
                onClick={() => onClose?.()}
                className="mt-6 text-amber-600 font-bold text-sm hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Scrollable Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {cartItems.map((item) => {
                  const imageUrl = item.image.startsWith("http")
                    ? item.image
                    : `${API_BASE_URL}${item.image}`;

                  const priceToUse =
                    item.isOnSale && item.discountedPrice > 0
                      ? item.discountedPrice
                      : item.price;

                  return (
                    <div key={item._id} className="flex gap-4 group">
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl bg-zinc-50 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                        <img
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                          src={imageUrl}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-400x300.png";
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatCurrency(priceToUse)} / unit
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg h-7">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-l-lg text-zinc-600 dark:text-zinc-400 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-6 text-center text-zinc-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-r-lg text-zinc-600 dark:text-zinc-400 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Item Total & Remove */}
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-amber-600 dark:text-amber-500">
                              {formatCurrency(priceToUse * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer / Summary */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Subtotal
                  </span>
                  <span className="text-xl font-black text-zinc-900 dark:text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleNavigate("/cart")}
                    className="py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => handleNavigate("/checkout")}
                    className="py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                  >
                    Checkout
                  </button>
                </div>

                <button
                  onClick={() => clearCart()}
                  className="mt-3 w-full text-xs text-zinc-400 hover:text-red-500 transition-colors py-1"
                >
                  Clear all items
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CartPreview;
