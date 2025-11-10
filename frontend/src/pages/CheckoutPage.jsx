import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

// 1. Import all the child components
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import PaymentPollingModal from "../components/checkout/PaymentPollingModal";
import DeliveryInfoForm from "../components/checkout/DeliveryInfoForm";
import PaymentMethodForm from "../components/checkout/PaymentMethodForm";

// Helper to format phone for M-Pesa
const formatPhoneForMpesa = (phone) => {
  let num = phone.replace(/\s/g, "").replace("+", "");
  if (num.startsWith("0")) {
    num = "254" + num.substring(1);
  }
  return num;
};

// Helper to validate phone
const isValidPhone = (phone) => {
  const num = phone.replace(/\s/g, "").replace("+", "");
  return (
    (num.length === 12 && num.startsWith("254")) ||
    (num.length === 10 && num.startsWith("0"))
  );
};

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [pollingOrderId, setPollingOrderId] = useState(null);
  const navigate = useNavigate();

  // Find primary address and payment from user
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

  // State for the forms
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentPhone, setPaymentPhone] = useState(primaryPayment.number);

  // Pre-fill forms when user data loads
  useEffect(() => {
    if (primaryAddress) {
      setDeliveryLocation(primaryAddress.details);
    }
  }, [primaryAddress]);

  useEffect(() => {
    setPaymentPhone(primaryPayment.number);
  }, [primaryPayment.number]);

  // Polling logic
  useEffect(() => {
    if (!isWaitingForPayment || !pollingOrderId) return;
    let intervalId;
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setIsWaitingForPayment(false);
      toast.error("Payment timed out. Please try again.");
    }, 120000);

    const pollPaymentStatus = async () => {
      try {
        const { data } = await api.get(`/orders/${pollingOrderId}/status`);
        if (data.isPaid || data.paymentStatus === "Successful") {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          clearCart();
          navigate(`/order-confirmed/${pollingOrderId}`);
        } else if (data.paymentStatus === "Failed") {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setIsWaitingForPayment(false);
          toast.error("Payment failed or was cancelled. Please try again.");
        }
      } catch (err) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        setIsWaitingForPayment(false);
        toast.error("An error occurred while checking payment.");
      }
    };
    intervalId = setInterval(pollPaymentStatus, 3000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isWaitingForPayment, pollingOrderId, navigate, clearCart]);

  const deliveryFee = subtotal > 0 ? 50.0 : 0.0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0 && !isWaitingForPayment) {
    return <Navigate to="/shop" replace />;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryLocation) {
      toast.error("Please enter a delivery location");
      return;
    }
    if (!isValidPhone(paymentPhone)) {
      toast.error("Please enter a valid phone number (e.g., 07... or 254...).");
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
      const { data: createdOrder } = await api.post("/orders", {
        orderItems,
        deliveryLocation,
        totalPrice: total,
        paymentMethod: "M-Pesa",
      });

      const phoneForMpesa = formatPhoneForMpesa(paymentPhone);

      await api.post("/payments/stkpush", {
        orderId: createdOrder._id,
        phone: phoneForMpesa,
        amount: total,
      });

      setLoading(false);
      setPollingOrderId(createdOrder._id);
      setIsWaitingForPayment(true);
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
              {/* 2. Use the imported components */}
              <DeliveryInfoForm
                deliveryLocation={deliveryLocation}
                setDeliveryLocation={setDeliveryLocation}
              />
              <PaymentMethodForm
                paymentPhone={paymentPhone}
                setPaymentPhone={setPaymentPhone}
              />
            </div>

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
