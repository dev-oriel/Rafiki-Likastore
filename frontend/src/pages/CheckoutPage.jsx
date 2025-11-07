import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

// (Helper component - We'll add 'export' to the original)
export const CheckoutSummary = ({ items, subtotal, deliveryFee, total }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
    <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-6">
      Order Summary
    </h2>
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center text-sm"
        >
          <div className="flex items-center gap-3">
            <img
              src={
                item.image.startsWith("http")
                  ? item.image
                  : `${import.meta.env.VITE_API_URL.replace("/api", "")}${
                      item.image
                    }`
              }
              alt={item.name}
              className="size-10 rounded-md object-contain bg-zinc-50 dark:bg-zinc-800"
            />
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {item.name}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">
                Qty: {item.quantity}
              </p>
            </div>
          </div>
          <p className="font-medium text-zinc-900 dark:text-zinc-300">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
      <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Subtotal</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Delivery Fee</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          ${deliveryFee.toFixed(2)}
        </span>
      </div>
      <div className="border-t border-solid border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-gray-100">
        <span>Total</span>
        <span className="text-amber-500">${total.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth(); // 1. Get user from auth
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Find primary address and payment from user
  const primaryAddress = useMemo(
    () => user?.addresses?.find((a) => a.isPrimary) || null,
    [user]
  );

  const primaryPayment = useMemo(
    () =>
      user?.paymentMethods?.find((p) => p.primary) || {
        number: user?.phone || "",
      }, // Fallback to user phone
    [user]
  );

  // 3. Set default delivery location to primary address, but make it editable
  const [deliveryLocation, setDeliveryLocation] = useState("");

  useEffect(() => {
    if (primaryAddress) {
      setDeliveryLocation(primaryAddress.details);
    }
  }, [primaryAddress]);

  // 4. Calculate totals
  const deliveryFee = subtotal > 0 ? 5.0 : 0.0;
  const total = subtotal + deliveryFee;

  // 5. Redirect to shop if cart is empty
  if (cartItems.length === 0 && !loading) {
    return <Navigate to="/shop" replace />;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryLocation) {
      toast.error("Please enter a delivery location");
      return;
    }
    if (!primaryPayment.number) {
      toast.error("Please add a payment phone number in your profile");
      return;
    }

    setLoading(true);

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id, // This will now be a valid ObjectId
    }));

    try {
      // 6. Create the order
      const { data: createdOrder } = await api.post("/orders", {
        orderItems,
        deliveryLocation,
        totalPrice: total,
        paymentMethod: "M-Pesa",
      });

      // 7. (FUTURE) Initiate STK Push
      // We use the primaryPayment number
      toast.success(
        `Order placed! Sending STK push to ${primaryPayment.number}...`
      );
      // await api.post('/payments/stkpush', {
      //   orderId: createdOrder._id,
      //   phone: primaryPayment.number.replace(/\s/g, ''), // Remove spaces
      //   amount: total,
      // });

      // 8. Clear cart and navigate
      clearCart();
      navigate(`/order-confirmed/${createdOrder._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-zinc-900 dark:text-gray-100 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-8">
          Checkout
        </h1>
        <form
          onSubmit={handlePlaceOrder}
          className="flex flex-col lg:flex-row gap-12 lg:gap-8"
        >
          <div className="flex-grow space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
                1. Delivery Information
              </h2>
              <label
                htmlFor="deliveryLocation"
                className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
              >
                Delivery Location (Hostel, Room, or Pickup Point)
              </label>
              <textarea
                id="deliveryLocation"
                rows="3"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g., Kabarak University, S Block, Room 101. Please call on arrival."
                className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500/20 sm:text-sm p-3"
                required
              />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
                2. Payment Method
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                An STK push will be sent to your primary M-Pesa number.
              </p>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="/images/mpesa.png" alt="M-Pesa" className="h-10" />
                  <div>
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">
                      M-Pesa STK Push
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {primaryPayment.number || "No phone number found"}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile#payment-methods"
                  className="text-sm font-medium text-amber-600 hover:underline"
                >
                  Change
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-96 lg:shrink-0">
            <div className="sticky top-28 space-y-4">
              <CheckoutSummary
                items={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-amber-500 text-white font-bold py-3.5 px-4 rounded-full text-base hover:bg-amber-600 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
