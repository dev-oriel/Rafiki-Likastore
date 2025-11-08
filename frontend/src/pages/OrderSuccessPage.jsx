import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency"; // 1. Import KES formatter
import { Loader } from "lucide-react";

// Re-usable Order Summary (we'll assume it's exported from CheckoutPage)
// If not, copy the component from CheckoutPage.jsx and paste it here
import { CheckoutSummary } from "./CheckoutPage";

const PageLoader = ({ text }) => (
  <div className="flex flex-col gap-4 justify-center items-center py-20">
    <Loader className="size-8 animate-spin text-amber-500" />
    <p className="text-zinc-500 dark:text-zinc-400">{text || "Loading..."}</p>
  </div>
);

const OrderSuccessPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${orderId}`);

        // 2. Check if the order is actually paid
        if (!data.isPaid) {
          // This could happen if the user navigates here directly
          setError("This order has not been paid for.");
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
        setError("Could not find your order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <PageLoader text="Confirming payment..." />;
  }

  if (error) {
    return <PageLoader text={error} />;
  }

  // Calculate totals from the fetched order data
  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const deliveryFee = order.totalPrice - subtotal;

  return (
    <main className="flex-1 py-10 md:py-16">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-7xl text-green-500">
            check_circle
          </span>
          <h1 className="mt-4 text-zinc-900 dark:text-gray-100 text-4xl font-black tracking-tight">
            Payment Received!
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Thank you for your purchase. Your order is now being processed.
          </p>

          {/* 3. Display the amount paid */}
          <div className="mt-4">
            <span className="text-zinc-500">Amount Paid</span>
            <p className="text-3xl font-bold text-amber-600">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Order ID: #{order._id}
          </p>
        </div>

        <div className="my-8">
          <CheckoutSummary
            items={order.orderItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={order.totalPrice}
          />
        </div>

        <div className="text-center">
          <Link
            to="/my-orders"
            className="w-full sm:w-auto mt-4 bg-amber-500 text-white font-bold py-3 px-6 rounded-full text-base hover:bg-amber-600 transition-opacity"
          >
            View All My Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;
