import React from "react"; // Removed useState and useMemo
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // 1. Import useCart
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";

const CartPage = () => {
  // 2. Get all data and functions from the global context
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <main className="flex-1 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <h1 className="text-zinc-900 dark:text-gray-100 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
            Your Cart
          </h1>
        </div>

        {cartItems.length === 0 ? (
          // --- EMPTY CART VIEW ---
          <div className="text-center bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg shadow-sm p-12">
            <span className="material-symbols-outlined text-6xl text-zinc-400">
              shopping_cart
            </span>
            <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
              Your cart is empty
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Looks like you haven't added any liquor yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="w-full sm:w-auto mt-8 bg-amber-500 text-white font-bold py-3 px-6 rounded-full text-base hover:bg-amber-600 transition-opacity"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          // --- CART ITEMS VIEW ---
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
            <div className="flex-grow">
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    // 3. Pass context functions directly
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              <Link
                className="inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-500 mt-8 text-sm font-medium transition-colors"
                to="/shop"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Continue Shopping
              </Link>
            </div>

            {/* 4. Pass real subtotal */}
            <OrderSummary subtotal={subtotal} />
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
