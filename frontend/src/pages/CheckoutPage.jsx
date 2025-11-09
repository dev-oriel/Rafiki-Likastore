import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

// (CheckoutSummary Component - no changes, but must be exported)
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
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      ))}
      <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Subtotal</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(subtotal)}
        </span>
      </div>
      <div className="flex justify-between text-zinc-600 dark:text-gray-400">
        <span>Delivery Fee</span>
        <span className="font-medium text-zinc-900 dark:text-gray-300">
          {formatCurrency(deliveryFee)}
        </span>
      </div>
      <div className="border-t border-solid border-zinc-200 dark:border-zinc-700 my-4"></div>
      <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-gray-100">
        <span>Total</span>
        <span className="text-amber-500">{formatCurrency(total)}</span>
      </div>
    </div>
  </div>
);

// --- New Polling Modal Component ---
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

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [pollingOrderId, setPollingOrderId] = useState(null);
  const navigate = useNavigate();

  const primaryAddress = useMemo(
    () => user?.addresses?.find((a) => a.isPrimary) || null,
    [user]
  );

  const primaryPayment = useMemo(
    () =>
      user?.paymentMethods?.find((p) => p.primary) || {
        number: user?.phone || "",
      },
    [user]
  );

  const [deliveryLocation, setDeliveryLocation] = useState("");

  useEffect(() => {
    if (primaryAddress) {
      setDeliveryLocation(primaryAddress.details);
    }
  }, [primaryAddress]);

  const deliveryFee = subtotal > 0 ? 1.0 : 0.0;
  const total = subtotal + deliveryFee;

  // --- Updated Polling Logic ---
  useEffect(() => {
    if (!isWaitingForPayment || !pollingOrderId) return;

    // Create a variable for the interval
    let intervalId;

    // Create a timeout in case M-Pesa never sends a callback
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId); // Stop polling
      setIsWaitingForPayment(false); // Stop loader
      toast.error("Payment timed out. Please try again.");
    }, 120000); // 2 minute timeout

    // Define the polling function
    const pollPaymentStatus = async () => {
      try {
        const { data } = await api.get(`/orders/${pollingOrderId}/status`);

        // --- THIS IS THE FIX ---
        if (data.isPaid || data.paymentStatus === "Successful") {
          // SUCCESS!
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          clearCart();
          navigate(`/order-confirmed/${pollingOrderId}`);
        } else if (data.paymentStatus === "Failed") {
          // FAILURE!
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setIsWaitingForPayment(false); // Stop the loader
          toast.error("Payment failed or was cancelled. Please try again.");
        }
        // If status is 'Pending', do nothing and let the interval run again
        // --- END OF FIX ---
      } catch (err) {
        console.error("Polling error:", err);
        // Stop polling on a 404 or other critical error
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        setIsWaitingForPayment(false);
        toast.error(
          "An error occurred while checking payment. Please try again."
        );
      }
    };

    // Start polling every 3 seconds
    intervalId = setInterval(pollPaymentStatus, 3000);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isWaitingForPayment, pollingOrderId, navigate, clearCart]);
  // --- End Polling Logic ---

  if (cartItems.length === 0 && !isWaitingForPayment) {
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
      product: item._id,
    }));

    try {
      // 1. Create the order in the DB first
      const { data: createdOrder } = await api.post("/orders", {
        orderItems,
        deliveryLocation,
        totalPrice: total,
        paymentMethod: "M-Pesa",
      });

      // 2. Trigger the STK Push
      const phoneForMpesa = primaryPayment.number
        .replace(/\s/g, "")
        .replace("+", "");

      await api.post("/payments/stkpush", {
        orderId: createdOrder._id,
        phone: phoneForMpesa,
        amount: total,
      });

      // 3. Show the "Waiting" modal
      setLoading(false);
      setPollingOrderId(createdOrder._id);
      setIsWaitingForPayment(true);
      // The useEffect will now take over
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <>
      {isWaitingForPayment && <PaymentPollingModal orderId={pollingOrderId} />}
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
              {/* Delivery Info form */}
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

              {/* Payment Method display */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-gray-100 mb-4">
                  2. Payment Method
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  An STK push will be sent to your primary M-Pesa number.
                </p>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/mpesa.png"
                      alt="M-Pesa"
                      className="h-10"
                    />
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
                  disabled={loading || isWaitingForPayment}
                  className="w-full mt-4 bg-amber-500 text-white font-bold py-3.5 px-4 rounded-full text-base hover:bg-amber-600 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    "Place Order & Pay"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
