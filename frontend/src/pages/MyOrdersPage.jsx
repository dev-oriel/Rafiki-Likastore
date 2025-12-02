import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

// Helper functions
const getStatus = (order) => {
  if (order.isDelivered)
    return {
      text: "Delivered",
      class: "bg-green-100 text-green-700 border-green-200",
    };
  if (order.isPaid)
    return {
      text: "Processing",
      class: "bg-blue-100 text-blue-700 border-blue-200",
    };
  // Reverted to "Pending Payment"
  return {
    text: "Pending Payment",
    class: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
};

// Component for a single order row/card
const OrderRow = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const status = getStatus(order);

  // Expanded details content
  const OrderDetails = () => (
    <div className="mt-4 border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-4">
      <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">
        Items Ordered
      </h4>
      <ul className="space-y-2 mb-4">
        {order.orderItems.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"
          >
            <span>
              {item.qty}x {item.name}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {formatCurrency(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
        <p>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            Delivery:
          </span>{" "}
          {order.deliveryLocation}
        </p>
        <p>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            Payment:
          </span>{" "}
          {order.isPaid ? `Paid via M-Pesa` : "Pending"}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP ROW (Hidden on mobile) --- */}
      <tr className="hidden md:table-row border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
        <td className="p-4 text-zinc-800 dark:text-zinc-200 font-mono text-sm">
          #{order._id.substring(18)}
        </td>
        <td className="p-4 text-zinc-600 dark:text-zinc-400 text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </td>
        <td className="p-4 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
          {formatCurrency(order.totalPrice)}
        </td>
        <td className="p-4">
          <span
            className={`${status.class} text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap`}
          >
            {status.text}
          </span>
        </td>
        <td className="p-4 text-right">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            {isOpen ? "Close" : "View"}
          </button>
        </td>
      </tr>

      {/* Desktop Expanded Details */}
      {isOpen && (
        <tr className="hidden md:table-row bg-zinc-50/50 dark:bg-zinc-900/50">
          <td colSpan="5" className="p-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
              <OrderDetails />
            </div>
          </td>
        </tr>
      )}

      {/* --- MOBILE CARD (Visible on mobile) --- */}
      <div className="md:hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <span className="font-mono text-xs text-zinc-400">
              #{order._id.substring(18)}
            </span>
            <p className="font-bold text-zinc-900 dark:text-white mt-0.5">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
          {/* Status Badge */}
          <span
            className={`${status.class} text-[10px] font-bold px-2 py-0.5 rounded-full border text-center max-w-[50%]`}
          >
            {status.text}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          <span>{order.orderItems.length} items</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          {isOpen ? "Hide Details" : "View Details"}
        </button>

        {isOpen && <OrderDetails />}
      </div>
    </>
  );
};

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders/myorders");

        const visibleOrders = data.filter(
          (order) =>
            !(order.paymentResult && order.paymentResult.status === "Failed")
        );

        setOrders(
          visibleOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  let content;
  if (loading) {
    content = (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-zinc-500">Loading your orders...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-12 px-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
      </div>
    );
  } else if (orders.length === 0) {
    content = (
      <div className="text-center py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">
          receipt_long
        </span>
        <p className="text-zinc-900 dark:text-white font-medium">
          No orders found
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          Looks like you haven't placed an order yet.
        </p>
      </div>
    );
  } else {
    content = (
      <>
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Order ID
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Date
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Total
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List (Visible on Mobile) */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 sm:mb-8">
        My Orders
      </h1>
      {content}
    </div>
  );
};

export default MyOrdersPage;
