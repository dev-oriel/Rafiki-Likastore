import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <main className="flex-1 py-6 sm:py-10 md:py-16 bg-zinc-50 dark:bg-black/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-zinc-900 dark:text-gray-100 text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Your Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          // --- EMPTY CART VIEW ---
          <div className="text-center bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm p-10 sm:p-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
              <span className="material-symbols-outlined text-4xl text-zinc-400">
                shopping_cart
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              Your cart is empty
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
              Looks like you haven't added any liquor yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-8 bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-sm sm:text-base hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // --- CART ITEMS VIEW ---
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Cart Items List */}
            <div className="grow">
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              <Link
                className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 mt-8 text-sm font-bold transition-colors"
                to="/shop"
              >
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
                Continue Shopping
              </Link>
            </div>

            {/* Summary Panel */}
            <OrderSummary subtotal={subtotal} />
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
