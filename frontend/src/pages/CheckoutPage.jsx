import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

// Child components
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import PaymentPollingModal from "../components/checkout/PaymentPollingModal";
import DeliveryInfoForm from "../components/checkout/DeliveryInfoForm";
import PaymentMethodForm from "../components/checkout/PaymentMethodForm";

const formatPhoneForMpesa = (phone) => {
  let num = phone.replace(/\s/g, "").replace("+", "");
  if (num.startsWith("0")) {
    num = "254" + num.substring(1);
  }
  return num;
};

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
  const [paymentPhone, setPaymentPhone] = useState(primaryPayment.number);

  useEffect(() => {
    if (primaryAddress) {
      setDeliveryLocation(primaryAddress.details);
    }
  }, [primaryAddress]);

  useEffect(() => {
    setPaymentPhone(primaryPayment.number);
  }, [primaryPayment.number]);

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

      <main className="flex-1 py-6 sm:py-10 md:py-16 bg-zinc-50 dark:bg-black/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-zinc-900 dark:text-gray-100 text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-6 sm:mb-8">
            Checkout
          </h1>

          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col lg:flex-row gap-8 lg:gap-12"
          >
            {/* Forms Section */}
            <div className="flex-grow space-y-6 sm:space-y-8 order-2 lg:order-1">
              <DeliveryInfoForm
                deliveryLocation={deliveryLocation}
                setDeliveryLocation={setDeliveryLocation}
              />
              <PaymentMethodForm
                paymentPhone={paymentPhone}
                setPaymentPhone={setPaymentPhone}
              />
            </div>

            {/* Summary Section */}
            <div className="w-full lg:w-96 lg:shrink-0 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24 space-y-4">
                <CheckoutSummary
                  items={cartItems}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  total={total}
                />

                <button
                  type="submit"
                  disabled={loading || isWaitingForPayment}
                  className="w-full mt-4 bg-amber-500 text-white font-bold py-3.5 px-6 rounded-full text-base hover:bg-amber-600 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={24} />
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
